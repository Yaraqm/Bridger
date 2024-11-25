const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path to your database configuration

const RedemptionHistory = sequelize.define('RedemptionHistory', {
    redemption_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    points_redeemed: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'redemptionhistory', // Table name
    timestamps: true, // Adds createdAt and updatedAt columns
});

module.exports = RedemptionHistory;
