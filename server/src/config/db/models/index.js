const { sequelize } = require("../index");
const User = require("./User");
const Issue = require("./Issue");
// User has many Issues
User.hasMany(Issue, {
  foreignKey: "createdBy",
  as: "createdIssues",
});

// User has many Issues
User.hasMany(Issue, {
  foreignKey: "assignedTo",
  as: "assignedIssues",
});

// Issue belongs to User
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

//Export all models and sequelize instance
module.exports = {
  sequelize,
  User,
  Issue,
  IssueStatus: require("./IssueStatus"),
  IssuePriority: require("./IssuePriority"),
};
