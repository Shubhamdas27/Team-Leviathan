import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validation";
import {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Registration validation
const registerValidation = [
  body("fullName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone")
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),
  body("address.street")
    .trim()
    .notEmpty()
    .withMessage("Street address is required"),
  body("address.city").trim().notEmpty().withMessage("City is required"),
  body("address.state").trim().notEmpty().withMessage("State is required"),
  body("address.zipCode").trim().notEmpty().withMessage("Zip code is required"),
];

// Login validation
const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Profile update validation
const profileUpdateValidation = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),
  body("address.street")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Street address cannot be empty"),
  body("address.city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City cannot be empty"),
  body("address.state")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State cannot be empty"),
  body("address.zipCode")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Zip code cannot be empty"),
];

// Password reset validation
const passwordResetValidation = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// Routes
router.post(
  "/register",
  registerValidation,
  validate(registerValidation),
  register
);
router.post("/login", loginValidation, validate(loginValidation), login);
router.get("/profile", authenticate, getProfile);
router.put(
  "/profile",
  authenticate,
  profileUpdateValidation,
  validate(profileUpdateValidation),
  updateProfile
);
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Please provide a valid email")],
  validate([
    body("email").isEmail().withMessage("Please provide a valid email"),
  ]),
  forgotPassword
);
router.post(
  "/reset-password/:token",
  passwordResetValidation,
  validate(passwordResetValidation),
  resetPassword
);

export default router;
