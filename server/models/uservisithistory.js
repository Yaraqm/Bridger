const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Venue = require('./venue'); // Assuming you have a Venue model

const UserVisitHistory = sequelize.define('UserVisitHistory', {
  visit_id: {
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
  visit_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'uservisithistory',
  timestamps: false,
});

// Associate Venue if needed
UserVisitHistory.belongsTo(Venue, { foreignKey: 'venue_id' });

module.exports = UserVisitHistory;
