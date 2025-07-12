import { Request, Response } from "express";
import { Swap } from "../models/Swap";
import { Item } from "../models/Item";
import { User } from "../models/User";
import { AuthRequest } from "../middleware/auth";
import { sendEmail, emailTemplates } from "../services/emailService";

// @desc    Create swap request
// @route   POST /api/swaps
// @access  Private
export const createSwap = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { requestedItem, offeredItem, pointsOffered, message } = req.body;

    // Get the requested item
    const item = await Item.findById(requestedItem).populate("owner");
    if (!item) {
      res.status(404).json({
        success: false,
        message: "Requested item not found",
      });
      return;
    }

    // Check if item is available
    if (item.status !== "available" || !item.isApproved) {
      res.status(400).json({
        success: false,
        message: "Item is not available for swap",
      });
      return;
    }

    // Check if user is trying to swap their own item
    if (item.owner._id.toString() === req.user!._id.toString()) {
      res.status(400).json({
        success: false,
        message: "Cannot swap your own item",
      });
      return;
    }

    // If offering an item, verify ownership and availability
    if (offeredItem) {
      const offeredItemDoc = await Item.findById(offeredItem);
      if (!offeredItemDoc) {
        res.status(404).json({
          success: false,
          message: "Offered item not found",
        });
        return;
      }

      if (offeredItemDoc.owner.toString() !== req.user!._id.toString()) {
        res.status(403).json({
          success: false,
          message: "You can only offer items you own",
        });
        return;
      }

      if (offeredItemDoc.status !== "available" || !offeredItemDoc.isApproved) {
        res.status(400).json({
          success: false,
          message: "Offered item is not available for swap",
        });
        return;
      }
    }

    // If offering points, check if user has enough points
    if (pointsOffered) {
      if (req.user!.points < pointsOffered) {
        res.status(400).json({
          success: false,
          message: "Insufficient points",
        });
        return;
      }
    }

    // Check for existing pending swap
    const existingSwap = await Swap.findOne({
      requester: req.user!._id,
      requestedItem,
      status: "pending",
    });

    if (existingSwap) {
      res.status(400).json({
        success: false,
        message: "You already have a pending swap request for this item",
      });
      return;
    }

    // Create swap request
    const swap = await Swap.create({
      requester: req.user!._id,
      owner: item.owner._id,
      requestedItem,
      offeredItem,
      pointsOffered,
      message,
    });

    // Populate the swap for response
    await swap.populate([
      { path: "requester", select: "fullName avatar" },
      { path: "owner", select: "fullName email" },
      { path: "requestedItem", select: "title images" },
      { path: "offeredItem", select: "title images" },
    ]);

    // Send email notification to item owner
    try {
      const emailTemplate = emailTemplates.swapRequest(
        req.user!.fullName,
        item.title
      );

      await sendEmail({
        to: (item.owner as any).email,
        ...emailTemplate,
      });
    } catch (emailError) {
      console.error("Failed to send swap notification email:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Swap request created successfully",
      data: { swap },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Get user swaps
// @route   GET /api/swaps
// @access  Private
export const getUserSwaps = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {
      $or: [{ requester: req.user!._id }, { owner: req.user!._id }],
    };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const swaps = await Swap.find(filter)
      .populate([
        { path: "requester", select: "fullName avatar" },
        { path: "owner", select: "fullName avatar" },
        { path: "requestedItem", select: "title images pointValue" },
        { path: "offeredItem", select: "title images pointValue" },
      ])
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Swap.countDocuments(filter);

    res.json({
      success: true,
      data: {
        swaps,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Accept swap request
// @route   PUT /api/swaps/:id/accept
// @access  Private
export const acceptSwap = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const swap = await Swap.findById(req.params.id).populate([
      { path: "requester", select: "fullName email points" },
      { path: "owner", select: "fullName email" },
      { path: "requestedItem", select: "title pointValue" },
      { path: "offeredItem", select: "title" },
    ]);

    if (!swap) {
      res.status(404).json({
        success: false,
        message: "Swap request not found",
      });
      return;
    }

    // Check if user is the owner of the requested item
    if (swap.owner._id.toString() !== req.user!._id.toString()) {
      res.status(403).json({
        success: false,
        message: "Not authorized to accept this swap",
      });
      return;
    }

    // Check if swap is still pending
    if (swap.status !== "pending") {
      res.status(400).json({
        success: false,
        message: "Swap request is no longer pending",
      });
      return;
    }

    // Handle point-based swap
    if (swap.pointsOffered) {
      // Check if requester still has enough points
      const requester = await User.findById(swap.requester._id);
      if (!requester || requester.points < swap.pointsOffered) {
        res.status(400).json({
          success: false,
          message: "Requester no longer has sufficient points",
        });
        return;
      }

      // Transfer points
      requester.points -= swap.pointsOffered;
      req.user!.points += swap.pointsOffered;

      await requester.save();
      await req.user!.save();
    }

    // Update swap status
    swap.status = "accepted";
    await swap.save();

    // Update item statuses
    await Item.findByIdAndUpdate(swap.requestedItem._id, { status: "pending" });
    if (swap.offeredItem) {
      await Item.findByIdAndUpdate(swap.offeredItem._id, { status: "pending" });
    }

    // Send email notification to requester
    try {
      const emailTemplate = emailTemplates.swapAccepted(
        req.user!.fullName,
        (swap.requestedItem as any).title
      );

      await sendEmail({
        to: (swap.requester as any).email,
        ...emailTemplate,
      });
    } catch (emailError) {
      console.error("Failed to send swap acceptance email:", emailError);
    }

    res.json({
      success: true,
      message: "Swap request accepted successfully",
      data: { swap },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Reject swap request
// @route   PUT /api/swaps/:id/reject
// @access  Private
export const rejectSwap = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { rejectionReason } = req.body;

    const swap = await Swap.findById(req.params.id).populate([
      { path: "requester", select: "fullName email" },
      { path: "owner", select: "fullName" },
      { path: "requestedItem", select: "title" },
    ]);

    if (!swap) {
      res.status(404).json({
        success: false,
        message: "Swap request not found",
      });
      return;
    }

    // Check if user is the owner of the requested item
    if (swap.owner._id.toString() !== req.user!._id.toString()) {
      res.status(403).json({
        success: false,
        message: "Not authorized to reject this swap",
      });
      return;
    }

    // Check if swap is still pending
    if (swap.status !== "pending") {
      res.status(400).json({
        success: false,
        message: "Swap request is no longer pending",
      });
      return;
    }

    // Update swap status
    swap.status = "rejected";
    swap.rejectionReason = rejectionReason;
    await swap.save();

    // Send email notification to requester
    try {
      const emailTemplate = emailTemplates.swapRejected(
        req.user!.fullName,
        (swap.requestedItem as any).title,
        rejectionReason
      );

      await sendEmail({
        to: (swap.requester as any).email,
        ...emailTemplate,
      });
    } catch (emailError) {
      console.error("Failed to send swap rejection email:", emailError);
    }

    res.json({
      success: true,
      message: "Swap request rejected successfully",
      data: { swap },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Complete swap
// @route   PUT /api/swaps/:id/complete
// @access  Private
export const completeSwap = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const swap = await Swap.findById(req.params.id).populate([
      "requester",
      "owner",
      "requestedItem",
      "offeredItem",
    ]);

    if (!swap) {
      res.status(404).json({
        success: false,
        message: "Swap request not found",
      });
      return;
    }

    // Check if user is involved in this swap
    const isInvolved =
      swap.requester._id.toString() === req.user!._id.toString() ||
      swap.owner._id.toString() === req.user!._id.toString();

    if (!isInvolved) {
      res.status(403).json({
        success: false,
        message: "Not authorized to complete this swap",
      });
      return;
    }

    // Check if swap is accepted
    if (swap.status !== "accepted") {
      res.status(400).json({
        success: false,
        message: "Swap must be accepted before completion",
      });
      return;
    }

    // Update swap status
    swap.status = "completed";
    swap.completedAt = new Date();
    await swap.save();

    // Update item statuses
    await Item.findByIdAndUpdate(swap.requestedItem._id, { status: "swapped" });
    if (swap.offeredItem) {
      await Item.findByIdAndUpdate(swap.offeredItem._id, { status: "swapped" });
    }

    res.json({
      success: true,
      message: "Swap completed successfully",
      data: { swap },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
