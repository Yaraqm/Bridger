const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Venue = require('./venue')


const StarredLocation = sequelize.define('StarredLocation', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  venue_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  starred_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  share_with: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'starredlocation',
  timestamps: false,
});

// Ensure the correct association between StarredLocation and Venue
StarredLocation.belongsTo(Venue, { foreignKey: 'venue_id' });

module.exports = StarredLocation;
