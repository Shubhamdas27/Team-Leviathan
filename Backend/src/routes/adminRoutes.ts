import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validation";
import { authenticate, authorize } from "../middleware/auth";
import {
  getAllUsers,
  getPendingItems,
  approveItem,
  rejectItem,
  deleteItem,
  getPlatformStats,
  updateUserRole,
  bulkApproveItems,
} from "../controllers/adminController";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize("admin"));

// Item rejection validation
const itemRejectionValidation = [
  body("rejectionReason")
    .trim()
    .isLength({ min: 10, max: 300 })
    .withMessage("Rejection reason must be between 10 and 300 characters"),
];

// User role update validation
const roleUpdateValidation = [
  body("role")
    .isIn(["user", "admin"])
    .withMessage('Role must be either "user" or "admin"'),
];

// Bulk approve validation
const bulkApproveValidation = [
  body("itemIds")
    .isArray({ min: 1 })
    .withMessage("At least one item ID is required"),
  body("itemIds.*")
    .isMongoId()
    .withMessage("All item IDs must be valid MongoDB ObjectIds"),
];

// Routes
router.get("/users", getAllUsers);
router.get("/items/pending", getPendingItems);
router.get("/stats", getPlatformStats);

router.put("/items/:id/approve", approveItem);
router.put(
  "/items/:id/reject",
  itemRejectionValidation,
  validate(itemRejectionValidation),
  rejectItem
);
router.delete("/items/:id", deleteItem);

router.put(
  "/users/:id/role",
  roleUpdateValidation,
  validate(roleUpdateValidation),
  updateUserRole
);

router.post(
  "/items/bulk-approve",
  bulkApproveValidation,
  validate(bulkApproveValidation),
  bulkApproveItems
);

export default router;
