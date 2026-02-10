const IssueModel = require("./issueModel");
const { USER_ROLES } = require("../../shared/constants/roleConstants");
const {
  successResponse,
  createdResponse,
  notFoundResponse,
  badRequestResponse,
  noContentResponse,
  forbiddenResponse,
} = require("../../shared/utils/responseHelper");
const {
  exportToCSV,
  exportToJSON,
  getExportFilename,
} = require("../../shared/utils/exportHelper");
const { NotFoundError } = require("../../middleware/errorHandler");

class IssueController {
  //get all issues with optional filters and sorting
  static async getAllIssues(req, res, next) {
    try {
      const {
        status,
        priority,
        fromDate,
        toDate,
        createdBy,
        sortBy = "created_at",
        sortOrder = "desc",
      } = req.query;

      const issues = await IssueModel.getAllIssues({
        status,
        priority,
        fromDate,
        toDate,
        createdBy,
        sortBy,
        sortOrder,
      });

      const formattedIssues = issues.map((issue) => formatIssueResponse(issue));

      return successResponse(
        res,
        formattedIssues,
        "Issues retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  //get issue counts grouped by status
  static async getStatusCounts(req, res, next) {
    try {
      const counts = await IssueModel.getStatusCounts();

      return successResponse(
        res,
        counts,
        "Status counts retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  //get issue counts grouped by status for the authenticated user
  static async getMyStatusCounts(req, res, next) {
    try {
      const counts = await IssueModel.getMyStatusCounts(req.user.userId);

      return successResponse(
        res,
        counts,
        "User status counts retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  // Export issues to CSV
  static async exportCSV(req, res, next) {
    try {
      const { status, priority, fromDate, toDate, createdBy } = req.query;

      const effectiveCreatedBy =
        req.user.role === USER_ROLES.USER ? req.user.userId : createdBy;

      const issues = await IssueModel.getIssuesForExport({
        status,
        priority,
        fromDate,
        toDate,
        createdBy: effectiveCreatedBy,
      });

      const csv = exportToCSV(issues);
      const filename = getExportFilename("csv");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );

      return res.send(csv);
    } catch (error) {
      next(error);
    }
  }

  // Export issues to JSON
  static async exportJSON(req, res, next) {
    try {
      const { status, priority, fromDate, toDate, createdBy } = req.query;
      const effectiveCreatedBy =
        req.user.role === USER_ROLES.USER ? req.user.userId : createdBy;

      const issues = await IssueModel.getIssuesForExport({
        status,
        priority,
        fromDate,
        toDate,
        createdBy: effectiveCreatedBy,
      });

      const jsonData = exportToJSON(issues);
      const filename = getExportFilename("json");

      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );

      return res.json(jsonData);
    } catch (error) {
      next(error);
    }
  }

  //get issue by ID
  static async getIssueById(req, res, next) {
    try {
      const { id } = req.params;

      const issue = await IssueModel.getIssueById(id);

      if (!issue) {
        return notFoundResponse(res, "Issue not found");
      }

      if (
        req.user.role === USER_ROLES.USER &&
        issue.created_by !== req.user.userId
      ) {
        return forbiddenResponse(res, "You can only view your own issues");
      }

      return successResponse(
        res,
        formatIssueResponse(issue),
        "Issue retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  // Create new issue
  static async createIssue(req, res, next) {
    try {
      const { title, description, status, priority, assignedTo } = req.body;
      const createdBy = req.user.userId;
      const attachment = req.file ? `/uploads/${req.file.filename}` : null;

      // Validation
      const errors = [];
      if (!title || !title.trim()) errors.push("Title is required");
      if (!description || !description.trim())
        errors.push("Description is required");
      if (!priority || !priority.trim()) errors.push("Priority is required");
      if (title && title.trim().length < 3)
        errors.push("Title must be at least 3 characters");
      if (title && title.trim().length > 50)
        errors.push("Title must be at most 50 characters");
      if (description && description.trim().length < 3)
        errors.push("Description must be at least 3 characters");
      if (description && description.trim().length > 225)
        errors.push("Description must be at most 225 characters");
      if (errors.length > 0) {
        return badRequestResponse(res, errors.join(", "));
      }

      const result = await IssueModel.createIssue({
        title,
        description,
        status,
        priority,
        createdBy,
        assignedTo,
        attachment,
      });

      // Get the created issue with full details
      const issue = await IssueModel.getIssueById(result.insertId);

      return createdResponse(
        res,
        formatIssueResponse(issue),
        "Issue created successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  // Update issue
  static async updateIssue(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, status, priority, assignedTo } = req.body;

      // Check if issue exists
      const existingIssue = await IssueModel.getIssueById(id);
      if (!existingIssue) {
        return notFoundResponse(res, "Issue not found");
      }

      // Users can only update their own issues
      if (
        req.user.role === USER_ROLES.USER &&
        existingIssue.created_by !== req.user.userId
      ) {
        return forbiddenResponse(res, "You can only update your own issues");
      }

      // Users cannot change status — only admin can
      if (req.user.role === USER_ROLES.USER && status) {
        return forbiddenResponse(res, "Only admin can change issue status");
      }

      // Validation
      const errors = [];
      if (title !== undefined && !title.trim())
        errors.push("Title is required");
      if (description !== undefined && !description.trim())
        errors.push("Description is required");
      if (priority !== undefined && !priority.trim())
        errors.push("Priority is required");
      if (title && title.trim().length < 3)
        errors.push("Title must be at least 3 characters");
      if (title && title.trim().length > 50)
        errors.push("Title must be at most 50 characters");
      if (description && description.trim().length < 3)
        errors.push("Description must be at least 3 characters");
      if (description && description.trim().length > 225)
        errors.push("Description must be at most 225 characters");
      if (errors.length > 0) {
        return badRequestResponse(res, errors.join(", "));
      }

      // Handle attachment
      const attachment = req.file ? `/uploads/${req.file.filename}` : undefined;
      await IssueModel.updateIssue(id, {
        title,
        description,
        status,
        priority,
        assignedTo,
        attachment,
      });

      const updatedIssue = await IssueModel.getIssueById(id);

      return successResponse(
        res,
        formatIssueResponse(updatedIssue),
        "Issue updated successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  // Update issue status (admin only)
  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const existingIssue = await IssueModel.getIssueById(id);
      if (!existingIssue) {
        return notFoundResponse(res, "Issue not found");
      }

      await IssueModel.updateStatus(id, status);

      const updatedIssue = await IssueModel.getIssueById(id);

      return successResponse(
        res,
        formatIssueResponse(updatedIssue),
        `Issue status updated to "${status}"`,
      );
    } catch (error) {
      next(error);
    }
  }

  // Delete issue
  static async deleteIssue(req, res, next) {
    try {
      const { id } = req.params;

      const existingIssue = await IssueModel.getIssueById(id);
      if (!existingIssue) {
        return notFoundResponse(res, "Issue not found");
      }

      await IssueModel.deleteIssue(id);

      return successResponse(res, null, "Issue deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  // Get issues filters
  static async getMyIssues(req, res, next) {
    try {
      const userId = req.user.userId;
      const { status, priority, fromDate, toDate } = req.query;

      const issues = await IssueModel.getAllIssues({
        status,
        priority,
        fromDate,
        toDate,
        createdBy: userId,
      });

      const formattedIssues = issues.map((issue) => formatIssueResponse(issue));

      return successResponse(
        res,
        formattedIssues,
        "Your issues retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }
  // Get metadata
  static async getMetadata(req, res, next) {
    try {
      const metadata = await IssueModel.getMetadata();
      return successResponse(res, metadata, "Metadata retrieved successfully");
    } catch (error) {
      next(error);
    }
  }
}

// Helper function to format issue response
function formatIssueResponse(issue) {
  return {
    id: issue.issue_id,
    title: issue.title,
    description: issue.description,
    status: issue.status,
    priority: issue.priority,
    createdBy: {
      id: issue.created_by,
      name: issue.creator_name,
      email: issue.creator_email,
    },
    assignedTo: issue.assigned_to
      ? {
          id: issue.assigned_to,
          name: issue.assignee_name,
          email: issue.assignee_email,
        }
      : null,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    resolvedAt: issue.resolved_at,
    attachment: issue.attachment || null,
  };
}

module.exports = IssueController;
