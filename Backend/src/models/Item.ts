import mongoose, { Document, Schema } from "mongoose";

export interface IItem extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category:
    | "dresses"
    | "tops"
    | "bottoms"
    | "accessories"
    | "shoes"
    | "outerwear";
  type: string;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  condition: "new" | "like-new" | "good" | "fair";
  color: string;
  brand?: string;
  images: string[];
  tags: string[];
  pointValue: number;
  owner: mongoose.Types.ObjectId;
  status: "available" | "pending" | "swapped" | "rejected";
  isApproved: boolean;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItem>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["dresses", "tops", "bottoms", "accessories", "shoes", "outerwear"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      trim: true,
    },
    size: {
      type: String,
      required: [true, "Size is required"],
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: ["new", "like-new", "good", "fair"],
    },
    color: {
      type: String,
      required: [true, "Color is required"],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    pointValue: {
      type: Number,
      required: true,
      min: [1, "Point value must be at least 1"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "pending", "swapped", "rejected"],
      default: "available",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate point value based on condition and brand
itemSchema.pre("save", function (next) {
  if (!this.pointValue) {
    let baseValue = 10;

    // Adjust based on condition
    switch (this.condition) {
      case "new":
        baseValue *= 2;
        break;
      case "like-new":
        baseValue *= 1.5;
        break;
      case "good":
        baseValue *= 1.2;
        break;
      case "fair":
        baseValue *= 1;
        break;
    }

    // Adjust based on brand (if premium brand)
    const premiumBrands = [
      "nike",
      "adidas",
      "gucci",
      "prada",
      "levi",
      "zara",
      "h&m",
    ];
    if (this.brand && premiumBrands.includes(this.brand.toLowerCase())) {
      baseValue *= 1.3;
    }

    this.pointValue = Math.round(baseValue);
  }
  next();
});

// Index for better search performance
itemSchema.index({ title: "text", description: "text", tags: "text" });
itemSchema.index({ category: 1, status: 1, isApproved: 1 });
itemSchema.index({ owner: 1 });
itemSchema.index({ createdAt: -1 });

export const Item = mongoose.model<IItem>("Item", itemSchema);
