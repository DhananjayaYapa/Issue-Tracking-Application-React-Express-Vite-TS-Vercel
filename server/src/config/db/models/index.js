const { sequelize } = require("../index");
const User = require("./User");
const Issue = require("./Issue");
const IssueStatus = require("./IssueStatus");
const IssuePriority = require("./IssuePriority");

// Only set up associations if models are available
if (User && Issue) {
  // User has many Issues
  User.hasMany(Issue, {
    foreignKey: "createdBy",
    as: "createdIssues",
  });

  // Issue belongs to User
  Issue.belongsTo(User, {
    foreignKey: "createdBy",
    as: "creator",
  });
}

if (Issue && IssueStatus) {
  // Issue has Status
  Issue.belongsTo(IssueStatus, {
    foreignKey: "statusId",
    as: "status",
  });
}

if (Issue && IssuePriority) {
  // Issue has Priority
  Issue.belongsTo(IssuePriority, {
    foreignKey: "priorityId",
    as: "priority",
  });
}

//Export all models and sequelize instance
module.exports = {
  sequelize,
  User,
  Issue,
  IssueStatus,
  IssuePriority,
};
