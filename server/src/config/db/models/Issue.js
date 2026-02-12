const { DataTypes } = require("sequelize");
const { sequelize } = require("../index");

const ISSUE_STATUS = ["Open", "In Progress", "Resolved", "Closed"];
const ISSUE_PRIORITY = ["Low", "Medium", "High", "Critical"];

const Issue = sequelize.define(
  "Issue",
  {
    issueId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "issue_id",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Title is required" },
        len: {
          args: [3, 255],
          msg: "Title must be between 3 and 255 characters",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "status_id",
      references: {
        model: "issue_statuses",
        key: "status_id",
      },
      defaultValue: 1, //1 is 'Open'
    },
    priorityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "priority_id",
      references: {
        model: "issue_priorities",
        key: "priority_id",
      },
      defaultValue: 2, //2 is 'Medium'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "created_by",
      references: {
        model: "users",
        key: "user_id",
      },
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "resolved_at",
    },
    attachment: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "attachment",
    },
  },
  {
    tableName: "issues",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["status_id"] },
      { fields: ["priority_id"] },
      { fields: ["created_by"] },
      { fields: ["created_at"] },
    ],
  },
);

module.exports = Issue;
