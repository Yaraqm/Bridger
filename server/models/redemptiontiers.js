const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RedemptionTier = sequelize.define('RedemptionTier', {
    tier_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    points_required: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reward_description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'redemptiontiers',
    timestamps: false,
});

module.exports = RedemptionTier;
