import { Request, Response } from "express";
import { User } from "../models/User";
import { Item } from "../models/Item";
import { Swap } from "../models/Swap";
import { AuthRequest } from "../middleware/auth";
import { sendEmail, emailTemplates } from "../services/emailService";

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: {
        users,
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

// @desc    Get pending items for approval
// @route   GET /api/admin/items/pending
// @access  Private/Admin
export const getPendingItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const items = await Item.find({ isApproved: false })
      .populate("owner", "fullName email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Item.countDocuments({ isApproved: false });

    res.json({
      success: true,
      data: {
        items,
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

// @desc    Approve item
// @route   PUT /api/admin/items/:id/approve
// @access  Private/Admin
export const approveItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "owner",
      "fullName email"
    );

    if (!item) {
      res.status(404).json({
        success: false,
        message: "Item not found",
      });
      return;
    }

    if (item.isApproved) {
      res.status(400).json({
        success: false,
        message: "Item is already approved",
      });
      return;
    }

    item.isApproved = true;
    await item.save();

    // Send email notification to item owner
    try {
      const emailTemplate = emailTemplates.itemApproved(item.title);
      await sendEmail({
        to: (item.owner as any).email,
        ...emailTemplate,
      });
    } catch (emailError) {
      console.error("Failed to send item approval email:", emailError);
    }

    res.json({
      success: true,
      message: "Item approved successfully",
      data: { item },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Reject item
// @route   PUT /api/admin/items/:id/reject
// @access  Private/Admin
export const rejectItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
      return;
    }

    const item = await Item.findById(req.params.id).populate(
      "owner",
      "fullName email"
    );

    if (!item) {
      res.status(404).json({
        success: false,
        message: "Item not found",
      });
      return;
    }

    item.rejectionReason = rejectionReason;
    item.status = "rejected";
    await item.save();

    // Send email notification to item owner
    try {
      const emailTemplate = emailTemplates.itemRejected(
        item.title,
        rejectionReason
      );
      await sendEmail({
        to: (item.owner as any).email,
        ...emailTemplate,
      });
    } catch (emailError) {
      console.error("Failed to send item rejection email:", emailError);
    }

    res.json({
      success: true,
      message: "Item rejected successfully",
      data: { item },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Delete item (inappropriate content)
// @route   DELETE /api/admin/items/:id
// @access  Private/Admin
export const deleteItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404).json({
        success: false,
        message: "Item not found",
      });
      return;
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getPlatformStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get basic counts
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const approvedItems = await Item.countDocuments({ isApproved: true });
    const pendingItems = await Item.countDocuments({ isApproved: false });
    const totalSwaps = await Swap.countDocuments();
    const completedSwaps = await Swap.countDocuments({ status: "completed" });
    const pendingSwaps = await Swap.countDocuments({ status: "pending" });

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });
    const recentItems = await Item.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });
    const recentSwaps = await Swap.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get category distribution
    const categoryStats = await Item.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get top users by points
    const topUsers = await User.find({})
      .select("fullName points")
      .sort({ points: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalItems,
          approvedItems,
          pendingItems,
          totalSwaps,
          completedSwaps,
          pendingSwaps,
        },
        recentActivity: {
          newUsers: recentUsers,
          newItems: recentItems,
          newSwaps: recentSwaps,
        },
        categoryDistribution: categoryStats,
        topUsers,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!["user", "admin"].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either "user" or "admin"',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      data: { user },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Bulk approve items
// @route   POST /api/admin/items/bulk-approve
// @access  Private/Admin
export const bulkApproveItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { itemIds } = req.body;

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      res.status(400).json({
        success: false,
        message: "Item IDs array is required",
      });
      return;
    }

    const result = await Item.updateMany(
      { _id: { $in: itemIds }, isApproved: false },
      { isApproved: true }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} items approved successfully`,
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
