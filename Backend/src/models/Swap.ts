import mongoose, { Document, Schema } from "mongoose";

export interface ISwap extends Document {
  _id: mongoose.Types.ObjectId;
  requester: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  requestedItem: mongoose.Types.ObjectId;
  offeredItem?: mongoose.Types.ObjectId;
  pointsOffered?: number;
  status: "pending" | "accepted" | "rejected" | "completed";
  message?: string;
  rejectionReason?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const swapSchema = new Schema<ISwap>(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Requester is required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    requestedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: [true, "Requested item is required"],
    },
    offeredItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    pointsOffered: {
      type: Number,
      min: [1, "Points offered must be at least 1"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    message: {
      type: String,
      maxlength: [500, "Message cannot exceed 500 characters"],
      trim: true,
    },
    rejectionReason: {
      type: String,
      maxlength: [300, "Rejection reason cannot exceed 300 characters"],
      trim: true,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Validate that either offeredItem or pointsOffered is provided
swapSchema.pre("save", function (next) {
  if (!this.offeredItem && !this.pointsOffered) {
    return next(new Error("Either an offered item or points must be provided"));
  }
  if (this.offeredItem && this.pointsOffered) {
    return next(new Error("Cannot offer both an item and points"));
  }
  next();
});

// Index for better query performance
swapSchema.index({ requester: 1, status: 1 });
swapSchema.index({ owner: 1, status: 1 });
swapSchema.index({ requestedItem: 1 });
swapSchema.index({ createdAt: -1 });

export const Swap = mongoose.model<ISwap>("Swap", swapSchema);
