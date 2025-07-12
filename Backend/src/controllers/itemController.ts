import { Request, Response } from "express";
import { Item } from "../models/Item";
import { AuthRequest } from "../middleware/auth";
import { sendEmail, emailTemplates } from "../services/emailService";

// @desc    Get all items
// @route   GET /api/items
// @access  Public
export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = { isApproved: true, status: "available" };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.size) {
      filter.size = req.query.size;
    }

    if (req.query.condition) {
      filter.condition = req.query.condition;
    }

    if (req.query.color) {
      filter.color = new RegExp(req.query.color as string, "i");
    }

    if (req.query.brand) {
      filter.brand = new RegExp(req.query.brand as string, "i");
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search as string };
    }

    // Build sort object
    let sort: any = { createdAt: -1 };
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case "newest":
          sort = { createdAt: -1 };
          break;
        case "oldest":
          sort = { createdAt: 1 };
          break;
        case "points-low":
          sort = { pointValue: 1 };
          break;
        case "points-high":
          sort = { pointValue: -1 };
          break;
      }
    }

    const items = await Item.find(filter)
      .populate("owner", "fullName avatar")
      .sort(sort)
      .limit(limit)
      .skip(skip);

    const total = await Item.countDocuments(filter);

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

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
export const getItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "owner",
      "fullName avatar address.city address.state"
    );

    if (!item) {
      res.status(404).json({
        success: false,
        message: "Item not found",
      });
      return;
    }

    res.json({
      success: true,
      data: { item },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Private
export const createItem = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const itemData = {
      ...req.body,
      owner: req.user!._id,
    };

    const item = await Item.create(itemData);

    res.status(201).json({
      success: true,
      message:
        "Item created successfully. It will be reviewed before appearing on the platform.",
      data: { item },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
export const updateItem = async (
  req: AuthRequest,
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

    // Check if user owns the item
    if (item.owner.toString() !== req.user!._id.toString()) {
      res.status(403).json({
        success: false,
        message: "Not authorized to update this item",
      });
      return;
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { ...req.body, isApproved: false }, // Reset approval status
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Item updated successfully. It will need to be re-approved.",
      data: { item: updatedItem },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = async (
  req: AuthRequest,
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

    // Check if user owns the item or is admin
    if (
      item.owner.toString() !== req.user!._id.toString() &&
      req.user!.role !== "admin"
    ) {
      res.status(403).json({
        success: false,
        message: "Not authorized to delete this item",
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

// @desc    Upload item images
// @route   POST /api/items/:id/images
// @access  Private
export const uploadItemImages = async (
  req: AuthRequest,
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

    // Check if user owns the item
    if (item.owner.toString() !== req.user!._id.toString()) {
      res.status(403).json({
        success: false,
        message: "Not authorized to upload images for this item",
      });
      return;
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
      return;
    }

    // Get image URLs (in production, these would be Cloudinary URLs)
    const imageUrls = req.files.map((file: any) => `/uploads/${file.filename}`);

    // Update item with new images
    item.images = [...item.images, ...imageUrls];
    await item.save();

    res.json({
      success: true,
      message: "Images uploaded successfully",
      data: {
        item,
        uploadedImages: imageUrls,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Get user's items
// @route   GET /api/users/items
// @access  Private
export const getUserItems = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const items = await Item.find({ owner: req.user!._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Item.countDocuments({ owner: req.user!._id });

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
