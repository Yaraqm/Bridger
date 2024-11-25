const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import the Sequelize instance

// Define the Venue model based on your venue table structure
const Venue = sequelize.define('Venue', {
  venue_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  accessibility_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  type: {
    type: DataTypes.ENUM(
      'foodservices',
      'artsandculture',
      'retail',
      'grocery',
      'nature',
      'tourism',
      'recreation'
    ),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  accessibility_available: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
  },
  latitude: {  // New field for latitude
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {  // New field for longitude
    type: DataTypes.FLOAT,
    allowNull: true,
  }
  
}, {
  tableName: 'venue', // Set the table name explicitly
  timestamps: false,  // Disable automatic createdAt and updatedAt fields
});



module.exports = Venue;
