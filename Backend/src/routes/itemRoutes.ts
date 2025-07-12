import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { uploadMultiple } from "../middleware/upload";
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  uploadItemImages,
  getUserItems,
} from "../controllers/itemController";

const router = express.Router();

// Item creation validation
const itemValidation = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("category")
    .isIn(["dresses", "tops", "bottoms", "accessories", "shoes", "outerwear"])
    .withMessage("Invalid category"),
  body("type").trim().notEmpty().withMessage("Type is required"),
  body("size")
    .isIn(["XS", "S", "M", "L", "XL", "XXL"])
    .withMessage("Invalid size"),
  body("condition")
    .isIn(["new", "like-new", "good", "fair"])
    .withMessage("Invalid condition"),
  body("color").trim().notEmpty().withMessage("Color is required"),
  body("images")
    .isArray({ min: 1 })
    .withMessage("At least one image is required"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
];

// Routes
router.get("/", getItems);
router.get("/user", authenticate, getUserItems);
router.get("/:id", getItem);
router.post(
  "/",
  authenticate,
  itemValidation,
  validate(itemValidation),
  createItem
);
router.put("/:id", authenticate, updateItem);
router.delete("/:id", authenticate, deleteItem);
router.post("/:id/images", authenticate, uploadMultiple, uploadItemImages);

export default router;
