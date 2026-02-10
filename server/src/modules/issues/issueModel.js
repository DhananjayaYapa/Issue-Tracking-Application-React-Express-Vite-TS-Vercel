/**
 * Issue Model - Issue Database Operations (Sequelize)
 * =====================================================
 * Handles all issue-related database queries using Sequelize ORM
 */

const { Issue, User, sequelize } = require("../../config/db/models");
const { Op } = require("sequelize");
const { ISSUE_STATUS } = require("../../shared/constants/issueConstants");

class IssueModel {
  /**
   * Get all issues with filters (no pagination - handled in frontend)
   * @param {Object} options - { status, priority, search, sortBy, sortOrder, createdBy }
   * @returns {Promise<Array>} - Array of issues
   */
  /**
   * Get all issues with filters (no pagination - handled in frontend)
   * @param {Object} options - { status, priority, search, sortBy, sortOrder, createdBy }
   * @returns {Promise<Array>} - Array of issues
   */
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

    // Build where clause
    const where = {};
    if (createdBy) where.createdBy = createdBy;

    if (fromDate || toDate) {
      where.created_at = {};
      if (fromDate) where.created_at[Op.gte] = new Date(fromDate);
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        where.created_at[Op.lte] = end;
      }
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
      ]; // Sort by ID usually better for priority
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
          model: User,
          as: "assignee",
          attributes: ["userId", "name", "email"],
        },
        {
          model: IssueStatus,
          as: "status",
          attributes: ["name"],
          where: statusWhere,
          required: !!status, // Inner join if filter exists
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

    // Format response to match existing API
    return rows.map((issue) => ({
      issue_id: issue.issueId,
      title: issue.title,
      description: issue.description,
      status: issue.status?.name,
      priority: issue.priority?.name,
      created_by: issue.createdBy,
      assigned_to: issue.assignedTo,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      resolved_at: issue.resolvedAt,
      creator_name: issue.creator?.name,
      creator_email: issue.creator?.email,
      assignee_name: issue.assignee?.name,
      assignee_email: issue.assignee?.email,
      attachment: issue.attachment,
    }));
  }

  /**
   * Get single issue by ID
   * @param {number} issueId - Issue ID
   * @returns {Promise<Object|null>} - Issue object or null
   */
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
        {
          model: User,
          as: "assignee",
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
      assigned_to: issue.assignedTo,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      resolved_at: issue.resolvedAt,
      creator_name: issue.creator?.name,
      creator_email: issue.creator?.email,
      assignee_name: issue.assignee?.name,
      assignee_email: issue.assignee?.email,
      attachment: issue.attachment,
    };
  }

  /**
   * Create new issue
   * @param {Object} issueData - { title, description, status, priority, createdBy, assignedTo }
   * @returns {Promise<Object>} - Created issue
   */
  static async createIssue(issueData) {
    const IssueStatus = require("../../config/db/models/IssueStatus");
    const IssuePriority = require("../../config/db/models/IssuePriority");

    const {
      title,
      description = null,
      status = "Open",
      priority = "Medium",
      createdBy,
      assignedTo = null,
      attachment = null,
    } = issueData;

    // Resolve IDs
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
      assignedTo,
      attachment,
    });

    return { insertId: issue.issueId };
  }

  /**
   * Update issue
   * @param {number} issueId - Issue ID
   * @param {Object} issueData - Fields to update
   * @returns {Promise<Object>} - Update result
   */
  static async updateIssue(issueId, issueData) {
    const IssueStatus = require("../../config/db/models/IssueStatus");
    const IssuePriority = require("../../config/db/models/IssuePriority");

    const { title, description, status, priority, assignedTo, attachment } =
      issueData;

    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (attachment !== undefined) updateData.attachment = attachment;

    if (status !== undefined) {
      const statusObj = await IssueStatus.findOne({ where: { name: status } });
      if (statusObj) {
        updateData.statusId = statusObj.statusId;
        // Set resolved_at if status is Resolved or Closed
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

  /**
   * Update issue status only
   * @param {number} issueId - Issue ID
   * @param {string} status - New status
   * @returns {Promise<Object>} - Update result
   */
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

  /**
   * Delete issue
   * @param {number} issueId - Issue ID
   * @returns {Promise<Object>} - Delete result
   */
  static async deleteIssue(issueId) {
    const affectedRows = await Issue.destroy({
      where: { issueId },
    });
    return { affectedRows };
  }

  /**
   * Get issue counts by status
   * @returns {Promise<Object>} - { Open: n, 'In Progress': n, Resolved: n, Closed: n, total: n }
   */
  /**
   * Get issue counts by status
   * @returns {Promise<Object>} - { Open: n, 'In Progress': n, Resolved: n, Closed: n, total: n }
   */
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
      // Sequelizes returns nested keys in raw mode like 'status.name'
      const statusName = row["status.name"];
      if (counts.hasOwnProperty(statusName)) {
        counts[statusName] = parseInt(row.count);
      }
      counts.total += parseInt(row.count);
    });

    return counts;
  }

  /**
   * Get issue counts by status for a specific user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - { Open: n, 'In Progress': n, Resolved: n, Closed: n, total: n }
   */
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

  /**
   * Check if issue exists
   * @param {number} issueId - Issue ID
   * @returns {Promise<boolean>} - True if exists
   */
  static async issueExists(issueId) {
    const count = await Issue.count({
      where: { issueId },
    });
    return count > 0;
  }

  /**
   * Check if user is the creator of the issue
   * @param {number} issueId - Issue ID
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} - True if user is the creator
   */
  static async isIssueOwner(issueId, userId) {
    const count = await Issue.count({
      where: { issueId, createdBy: userId },
    });
    return count > 0;
  }

  /**
   * Get all issues for export (no pagination)
   * @param {Object} options - { status, priority, search }
   * @returns {Promise<Array>} - All matching issues
   */
  static async getIssuesForExport(options = {}) {
    const { status, priority, fromDate, toDate, createdBy } = options;

    const where = {};

    if (createdBy) where.createdBy = createdBy;

    if (fromDate || toDate) {
      where.created_at = {};
      if (fromDate) where.created_at[Op.gte] = new Date(fromDate);
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        where.created_at[Op.lte] = end;
      }
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
          model: User,
          as: "assignee",
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
      assigned_to_name: issue.assignee?.name,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      resolved_at: issue.resolvedAt,
    }));
  }

  /**
   * Get metadata (statuses, priorities)
   * @returns {Promise<Object>} - Metadata arrays
   */
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
