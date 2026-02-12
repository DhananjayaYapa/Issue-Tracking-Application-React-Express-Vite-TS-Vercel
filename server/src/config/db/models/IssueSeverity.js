const { DataTypes } = require("sequelize");
const { sequelize } = require("../index");

let IssueSeverity = null;

if (sequelize) {
  IssueSeverity = sequelize.define(
    "IssueSeverity",
    {
      severityId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "severity_id",
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "issue_severities",
      timestamps: false,
    },
  );
}

module.exports = IssueSeverity;
