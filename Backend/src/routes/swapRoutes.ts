import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import {
  createSwap,
  getUserSwaps,
  acceptSwap,
  rejectSwap,
  completeSwap,
} from "../controllers/swapController";

const router = express.Router();

// Swap creation validation
const swapValidation = [
  body("requestedItem")
    .isMongoId()
    .withMessage("Valid requested item ID is required"),
  body("offeredItem")
    .optional()
    .isMongoId()
    .withMessage("Valid offered item ID is required if provided"),
  body("pointsOffered")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Points offered must be a positive integer"),
  body("message")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Message cannot exceed 500 characters"),
];

// Rejection validation
const rejectionValidation = [
  body("rejectionReason")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Rejection reason cannot exceed 300 characters"),
];

// Routes
router.post(
  "/",
  authenticate,
  swapValidation,
  validate(swapValidation),
  createSwap
);
router.get("/", authenticate, getUserSwaps);
router.put("/:id/accept", authenticate, acceptSwap);
router.put(
  "/:id/reject",
  authenticate,
  rejectionValidation,
  validate(rejectionValidation),
  rejectSwap
);
router.put("/:id/complete", authenticate, completeSwap);

export default router;
