/**
 * Models Index - Sequelize
 * ==========================
 * Central model registry with associations
 */

const { sequelize } = require("../index");
const User = require("./User");
const Issue = require("./Issue");

// =============================================
// Define Associations
// =============================================

// User has many Issues (as creator)
User.hasMany(Issue, {
  foreignKey: "createdBy",
  as: "createdIssues",
});

// User has many Issues (as assignee)
User.hasMany(Issue, {
  foreignKey: "assignedTo",
  as: "assignedIssues",
});

// Issue belongs to User (creator)
Issue.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

// Issue belongs to User (assignee)
Issue.belongsTo(User, {
  foreignKey: "assignedTo",
  as: "assignee",
});

// Issue has Status, Priority
Issue.belongsTo(require("./IssueStatus"), {
  foreignKey: "statusId",
  as: "status",
});

Issue.belongsTo(require("./IssuePriority"), {
  foreignKey: "priorityId",
  as: "priority",
});

// =============================================
// Export all models
// =============================================
module.exports = {
  sequelize,
  User,
  Issue,
  IssueStatus: require("./IssueStatus"),
  IssuePriority: require("./IssuePriority"),
};
