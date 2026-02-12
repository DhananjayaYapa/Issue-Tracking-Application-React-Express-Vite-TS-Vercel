const { sequelize } = require("../index");
const User = require("./User");
const Issue = require("./Issue");
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
