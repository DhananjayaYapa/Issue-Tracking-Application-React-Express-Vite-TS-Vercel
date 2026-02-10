/**
 * Issue Routes
 * ============
 * Handles all issue CRUD endpoints
 *
 * Adapted from: olympus-backend-services/express-server/routes/attendanceRoutes.js
 */

const express = require("express");
const router = express.Router();
const IssueController = require("./issueController");
const { authenticate, authorize } = require("../../middleware/auth");
const { USER_ROLES } = require("../../shared/constants/roleConstants");
const {
  validateRequest,
  createIssueValidation,
  updateIssueValidation,
  updateStatusValidation,
  issueIdValidation,
  listIssuesValidation,
} = require("../../middleware/validation");
const { asyncHandler } = require("../../middleware/errorHandler");
const { upload } = require("../../middleware/upload");

// ========================================
// All routes require authentication
// ========================================
router.use(authenticate);

/**
 * @route   GET /api/issues/metadata
 * @desc    Get issue metadata (statuses, priorities, severities)
 * @access  Private (all roles)
 */
router.get("/metadata", asyncHandler(IssueController.getMetadata));

// ========================================
// Static routes (must come before /:id)
// ========================================

/**
 * @route   GET /api/issues/stats/counts
 * @desc    Get issue counts grouped by status (all users)
 * @access  Private - Admin only
 */
router.get(
  "/stats/counts",
  authorize(USER_ROLES.ADMIN),
  asyncHandler(IssueController.getStatusCounts),
);

/**
 * @route   GET /api/issues/export/csv
 * @desc    Export issues to CSV file
 * @access  Private - Admin & User
 * @query   status, priority, search, fromDate, toDate, createdBy (optional filters)
 */
router.get("/export/csv", asyncHandler(IssueController.exportCSV));

/**
 * @route   GET /api/issues/export/json
 * @desc    Export issues to JSON file
 * @access  Private - Admin & User
 * @query   status, priority, search, fromDate, toDate, createdBy (optional filters)
 */
router.get("/export/json", asyncHandler(IssueController.exportJSON));

/**
 * @route   GET /api/issues/my-issues
 * @desc    Get issues created by the authenticated user
 * @access  Private - User role
 * @query   page, limit, status, priority
 */
router.get(
  "/my-issues",
  authorize(USER_ROLES.USER),
  listIssuesValidation,
  validateRequest,
  asyncHandler(IssueController.getMyIssues),
);

/**
 * @route   GET /api/issues/my-stats/counts
 * @desc    Get issue counts grouped by status for the authenticated user
 * @access  Private - User role
 */
router.get(
  "/my-stats/counts",
  authorize(USER_ROLES.USER),
  asyncHandler(IssueController.getMyStatusCounts),
);

// ========================================
// CRUD Routes
// ========================================

/**
 * @route   GET /api/issues
 * @desc    Get all issues with pagination and filters
 * @access  Private - Admin only
 * @query   page, limit, status, priority, search, sortBy, sortOrder
 */
router.get(
  "/",
  authorize(USER_ROLES.ADMIN),
  listIssuesValidation,
  validateRequest,
  asyncHandler(IssueController.getAllIssues),
);

/**
 * @route   POST /api/issues
 * @desc    Create new issue
 * @access  Private - User role
 * @body    { title, description?, status?, priority?, assignedTo? }
 */
router.post(
  "/",
  authorize(USER_ROLES.USER),
  upload.single("attachment"),
  createIssueValidation,
  validateRequest,
  asyncHandler(IssueController.createIssue),
);

/**
 * @route   GET /api/issues/:id
 * @desc    Get single issue by ID
 * @access  Private (all roles - users can view their own, admin can view any)
 */
router.get(
  "/:id",
  issueIdValidation,
  validateRequest,
  asyncHandler(IssueController.getIssueById),
);

/**
 * @route   PUT /api/issues/:id
 * @desc    Update issue (user can update own issue fields except status, admin can update any)
 * @access  Private (all roles)
 * @body    { title?, description?, priority?, assignedTo? }
 */
router.put(
  "/:id",
  upload.single("attachment"),
  updateIssueValidation,
  validateRequest,
  asyncHandler(IssueController.updateIssue),
);

/**
 * @route   PATCH /api/issues/:id/status
 * @desc    Update issue status only
 * @access  Private - Admin only
 * @body    { status }
 */
router.patch(
  "/:id/status",
  authorize(USER_ROLES.ADMIN),
  updateStatusValidation,
  validateRequest,
  asyncHandler(IssueController.updateStatus),
);

/**
 * @route   DELETE /api/issues/:id
 * @desc    Delete issue
 * @access  Private - Admin only
 */
router.delete(
  "/:id",
  authorize(USER_ROLES.ADMIN),
  issueIdValidation,
  validateRequest,
  asyncHandler(IssueController.deleteIssue),
);

module.exports = router;
