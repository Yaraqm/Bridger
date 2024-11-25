const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust to your database configuration

const UserReward = sequelize.define('UserReward', {
  reward_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  activity_type: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  points_associated: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'userrewards',
  timestamps: false,        
});

module.exports = UserReward;
