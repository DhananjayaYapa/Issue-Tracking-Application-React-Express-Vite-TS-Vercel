/**
 * User Management Routes (Admin)
 * ================================
 * Admin-only endpoints for managing users
 *
 * Pattern: Same as authRoutes.js and issueRoutes.js
 */

const express = require("express");
const router = express.Router();
const UserController = require("./userController");
const { authenticate, authorize } = require("../../middleware/auth");
const { USER_ROLES } = require("../../shared/constants/roleConstants");
const { asyncHandler } = require("../../middleware/errorHandler");

// ========================================
// All routes require authentication + admin role
// ========================================
router.use(authenticate);
router.use(authorize(USER_ROLES.ADMIN));

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private - Admin only
 */
router.get("/", asyncHandler(UserController.getAllUsers));

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private - Admin only
 */
router.get("/:id", asyncHandler(UserController.getUserById));

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete (disable) user
 * @access  Private - Admin only
 */
router.delete("/:id", asyncHandler(UserController.deleteUser));

module.exports = router;
