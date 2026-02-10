const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const IssuePriority = sequelize.define('IssuePriority', {
    priorityId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'priority_id'
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'issue_priorities',
    timestamps: false
});

module.exports = IssuePriority;
