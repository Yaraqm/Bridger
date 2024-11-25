const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust to your database configuration

const Feedback = sequelize.define('Feedback', {
  feedback_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  venue_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  accessibility_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 5, // Assuming scores range from 0 to 5
    },
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'feedback', // Table name in the database
  timestamps: false,     // Disable Sequelize's automatic timestamp columns (e.g., updatedAt)
});

module.exports = Feedback;
