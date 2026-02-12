const { Issue, User, sequelize } = require("../../config/db/models");
const { Op } = require("sequelize");
const { ISSUE_STATUS } = require("../../shared/constants/issueConstants");

class IssueModel {
  // Get all issues
  static async getAllIssues(options = {}) {
    const {
      status,
      priority,
      fromDate,
      toDate,
      sortBy = "created_at",
      sortOrder = "DESC",
      createdBy,
    } = options;

    const IssueStatus = require("../../config/db/models/IssueStatus");
    const IssuePriority = require("../../config/db/models/IssuePriority");

    const where = {};
    if (createdBy) where.createdBy = createdBy;

    if (fromDate && toDate) {
      // Both dates provided - filter as a range
      where.created_at = {
        [Op.gte]: new Date(fromDate),
        [Op.lte]: (() => {
          const end = new Date(toDate);
          end.setHours(23, 59, 59, 999);
          return end;
        })(),
      };
    } else if (fromDate) {
      // Only fromDate provided - filter for that specific date
      const start = new Date(fromDate);
      const end = new Date(fromDate);
      end.setHours(23, 59, 59, 999);
      where.created_at = {
        [Op.gte]: start,
        [Op.lte]: end,
      };
    } else if (toDate) {
      // Only toDate provided - filter for that specific date
      const start = new Date(toDate);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      where.created_at = {
        [Op.gte]: start,
        [Op.lte]: end,
      };
    }

    // Relation wheres
    const statusWhere = status ? { name: status } : {};
    const priorityWhere = priority ? { name: priority } : {};

    // Validate sort field
    const validSortFields = [
      "created_at",
      "updated_at",
      "title",
      "priority",
      "status",
    ];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : "created_at";
    const safeSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Handling sort by related columns
    let order = [[safeSortBy, safeSortOrder]];
    if (safeSortBy === "status") {
      order = [[{ model: IssueStatus, as: "status" }, "name", safeSortOrder]];
    } else if (safeSortBy === "priority") {
      order = [
        [{ model: IssuePriority, as: "priority" }, "priorityId", safeSortOrder],
      ];
    }

    const rows = await Issue.findAll({
      where,
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["userId", "name", "email"],
        },
        {
          model: IssueStatus,
          as: "status",
          attributes: ["name"],
          where: statusWhere,
          required: !!status,
        },
        {
          model: IssuePriority,
          as: "priority",
          attributes: ["name"],
          where: priorityWhere,
          required: !!priority,
        },
      ],
      order,
    });

    // Format response
    return rows.map((issue) => ({
      issue_id: issue.issueId,
      title: issue.title,
      description: issue.description,
      status: issue.status?.name,
      priority: issue.priority?.name,
      created_by: issue.createdBy,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      resolved_at: issue.resolvedAt,
      creator_name: issue.creator?.name,
      creator_email: issue.creator?.email,
      attachment: issue.attachment,
    }));
  }

  // Get issue by ID
  static async getIssueById(issueId) {
    const IssueStatus = require("../../config/db/models/IssueStatus");
    const IssuePriority = require("../../config/db/models/IssuePriority");

    const issue = await Issue.findByPk(issueId, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["userId", "name", "email"],
        },
        { model: IssueStatus, as: "status", attributes: ["name"] },
        { model: IssuePriority, as: "priority", attributes: ["name"] },
      ],
    });

    if (!issue) return null;

    return {
      issue_id: issue.issueId,
      title: issue.title,
      description: issue.description,
      status: issue.status?.name,
      priority: issue.priority?.name,
      created_by: issue.createdBy,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      resolved_at: issue.resolvedAt,
      creator_name: issue.creator?.name,
      creator_email: issue.creator?.email,
      attachment: issue.attachment,
    };
  }

  // Create new issue
  static async createIssue(issueData) {
    const IssueStatus = require("../../config/db/models/IssueStatus");
    const IssuePriority = require("../../config/db/models/IssuePriority");

    const {
      title,
      description = null,
      status = "Open",
      priority = "Medium",
      createdBy,
      attachment = null,
    } = issueData;

    const statusObj = await IssueStatus.findOne({ where: { name: status } });
    const priorityObj = await IssuePriority.findOne({
      where: { name: priority },
    });

    const issue = await Issue.create({
      title,
      description,
      statusId: statusObj?.statusId || 1,
      priorityId: priorityObj?.priorityId || 2,
      createdBy,
      attachment,
    });

    return { insertId: issue.issueId };
  }

 // Update issue
  static async updateIssue(issueId, issueData) {
    const IssueStatus = require("../../config/db/models/IssueStatus");
    const IssuePriority = require("../../config/db/models/IssuePriority");

    const { title, description, status, priority, attachment } = issueData;

    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (attachment !== undefined) updateData.attachment = attachment;

    if (status !== undefined) {
      const statusObj = await IssueStatus.findOne({ where: { name: status } });
      if (statusObj) {
        updateData.statusId = statusObj.statusId;
        if (status === "Resolved" || status === "Closed") {
          updateData.resolvedAt = new Date();
        }
      }
    }

    if (priority !== undefined) {
      const priorityObj = await IssuePriority.findOne({
        where: { name: priority },
      });
      if (priorityObj) updateData.priorityId = priorityObj.priorityId;
    }

    if (Object.keys(updateData).length === 0) {
      return { affectedRows: 0 };
    }

    const [affectedRows] = await Issue.update(updateData, {
      where: { issueId },
    });

    return { affectedRows };
  }

  // Update issue status
  static async updateStatus(issueId, status) {
    const IssueStatus = require("../../config/db/models/IssueStatus");
    const statusObj = await IssueStatus.findOne({ where: { name: status } });

    if (!statusObj) return { affectedRows: 0 };

    const updateData = { statusId: statusObj.statusId };

    if (status === "Resolved" || status === "Closed") {
      updateData.resolvedAt = new Date();
    } else {
      updateData.resolvedAt = null;
    }

    const [affectedRows] = await Issue.update(updateData, {
      where: { issueId },
    });

    return { affectedRows };
  }

  // Delete issue
  static async deleteIssue(issueId) {
    const affectedRows = await Issue.destroy({
      where: { issueId },
    });
    return { affectedRows };
  }

  // Get issue counts by status for all issues
  static async getStatusCounts() {
    const IssueStatus = require("../../config/db/models/IssueStatus");

    const results = await Issue.findAll({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("Issue.issue_id")), "count"],
      ],
      include: [
        {
          model: IssueStatus,
          as: "status",
          attributes: ["name"],
        },
      ],
      group: ["status.status_id", "status.name"],
      raw: true,
    });

    const counts = {
      Open: 0,
      "In Progress": 0,
      Resolved: 0,
      Closed: 0,
      total: 0,
    };

    results.forEach((row) => {
      const statusName = row["status.name"];
      if (counts.hasOwnProperty(statusName)) {
        counts[statusName] = parseInt(row.count);
      }
      counts.total += parseInt(row.count);
    });

    return counts;
  }

  // Get issue counts by status for a specific user
  static async getMyStatusCounts(userId) {
    const IssueStatus = require("../../config/db/models/IssueStatus");

    const results = await Issue.findAll({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("Issue.issue_id")), "count"],
      ],
      where: { createdBy: userId },
      include: [
        {
          model: IssueStatus,
          as: "status",
          attributes: ["name"],
        },
      ],
      group: ["status.status_id", "status.name"],
      raw: true,
    });

    const counts = {
      Open: 0,
      "In Progress": 0,
      Resolved: 0,
      Closed: 0,
      total: 0,
    };

    results.forEach((row) => {
      const statusName = row["status.name"];
      if (counts.hasOwnProperty(statusName)) {
        counts[statusName] = parseInt(row.count);
      }
      counts.total += parseInt(row.count);
    });

    return counts;
  }

  // Check if issue exists
  static async issueExists(issueId) {
    const count = await Issue.count({
      where: { issueId },
    });
    return count > 0;
  }

  // Check if user is the creator of the issue
  static async isIssueOwner(issueId, userId) {
    const count = await Issue.count({
      where: { issueId, createdBy: userId },
    });
    return count > 0;
  }

  // Get all issues for export
  static async getIssuesForExport(options = {}) {
    const { status, priority, fromDate, toDate, createdBy } = options;

    const where = {};

    if (createdBy) where.createdBy = createdBy;

    if (fromDate && toDate) {
      // Both dates provided - filter as a range
      where.created_at = {
        [Op.gte]: new Date(fromDate),
        [Op.lte]: (() => {
          const end = new Date(toDate);
          end.setHours(23, 59, 59, 999);
          return end;
        })(),
      };
    } else if (fromDate) {
      // Only fromDate provided - filter for that specific date
      const start = new Date(fromDate);
      const end = new Date(fromDate);
      end.setHours(23, 59, 59, 999);
      where.created_at = {
        [Op.gte]: start,
        [Op.lte]: end,
      };
    } else if (toDate) {
      // Only toDate provided - filter for that specific date
      const start = new Date(toDate);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      where.created_at = {
        [Op.gte]: start,
        [Op.lte]: end,
      };
    }

    const IssueStatus = require("../../config/db/models/IssueStatus");
    const IssuePriority = require("../../config/db/models/IssuePriority");

    const statusWhere = status ? { name: status } : {};
    const priorityWhere = priority ? { name: priority } : {};

    const issues = await Issue.findAll({
      where,
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["name"],
        },
        {
          model: IssueStatus,
          as: "status",
          attributes: ["name"],
          where: statusWhere,
          required: !!status,
        },
        {
          model: IssuePriority,
          as: "priority",
          attributes: ["name"],
          where: priorityWhere,
          required: !!priority,
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return issues.map((issue) => ({
      issue_id: issue.issueId,
      title: issue.title,
      description: issue.description,
      status: issue.status?.name,
      priority: issue.priority?.name,
      created_by_name: issue.creator?.name,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      resolved_at: issue.resolvedAt,
    }));
  }

  // Get metadata (statuses, priorities)
  static async getMetadata() {
    const IssueStatus = require("../../config/db/models/IssueStatus");
    const IssuePriority = require("../../config/db/models/IssuePriority");

    const [statuses, priorities] = await Promise.all([
      IssueStatus.findAll({
        attributes: ["name"],
        order: [["statusId", "ASC"]],
      }),
      IssuePriority.findAll({
        attributes: ["name"],
        order: [["priorityId", "ASC"]],
      }),
    ]);

    return {
      statuses: statuses.map((s) => s.name),
      priorities: priorities.map((p) => p.name),
    };
  }
}

module.exports = IssueModel;
