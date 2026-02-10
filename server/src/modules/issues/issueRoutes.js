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

router.use(authenticate);

router.get("/metadata", asyncHandler(IssueController.getMetadata));

//isuues counts by status
router.get(
  "/stats/counts",
  authorize(USER_ROLES.ADMIN),
  asyncHandler(IssueController.getStatusCounts),
);

//Export issues to csv
router.get("/export/csv", asyncHandler(IssueController.exportCSV));

//Export issues to json
router.get("/export/json", asyncHandler(IssueController.exportJSON));

 //Get issues created by the authenticated user
router.get(
  "/my-issues",
  authorize(USER_ROLES.USER),
  listIssuesValidation,
  validateRequest,
  asyncHandler(IssueController.getMyIssues),
);

//issue counts to users
router.get(
  "/my-stats/counts",
  authorize(USER_ROLES.USER),
  asyncHandler(IssueController.getMyStatusCounts),
);

//get all issues
router.get(
  "/",
  authorize(USER_ROLES.ADMIN),
  listIssuesValidation,
  validateRequest,
  asyncHandler(IssueController.getAllIssues),
);

//create issue
router.post(
  "/",
  authorize(USER_ROLES.USER),
  upload.single("attachment"),
  createIssueValidation,
  validateRequest,
  asyncHandler(IssueController.createIssue),
);

//get issue by id
router.get(
  "/:id",
  issueIdValidation,
  validateRequest,
  asyncHandler(IssueController.getIssueById),
);

//update issue
router.put(
  "/:id",
  upload.single("attachment"),
  updateIssueValidation,
  validateRequest,
  asyncHandler(IssueController.updateIssue),
);

//update issue status
router.patch(
  "/:id/status",
  authorize(USER_ROLES.ADMIN),
  updateStatusValidation,
  validateRequest,
  asyncHandler(IssueController.updateStatus),
);

//delete issue
router.delete(
  "/:id",
  authorize(USER_ROLES.ADMIN),
  issueIdValidation,
  validateRequest,
  asyncHandler(IssueController.deleteIssue),
);

module.exports = router;
