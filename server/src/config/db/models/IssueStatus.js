const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const IssueStatus = sequelize.define('IssueStatus', {
    statusId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'status_id'
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'issue_statuses',
    timestamps: false
});

module.exports = IssueStatus;
