const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import the Sequelize instance

// Define the User model based on your existing user table
const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'user_id' 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password_hash' 
  },
  friend_user_ids: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: '[]', 
  },
  accessibility_preferences: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
  },
  high_contrast: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, 
  },
  screen_reader: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, 
  },
  keyboard_navigation: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW, 
  },
  friend_user_ids_str: {  // New column to store friend IDs as a string
    type: DataTypes.STRING,  // Change type to STRING for storing as a comma-separated list
    allowNull: true,
    field: 'friend_user_ids_str', // Match database column name
  },
  total_points: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  postal: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'user', // Set the table name if necessary (default is pluralized model name)
  timestamps: false, // If your table doesn't have 'created_at' and 'updated_at'
});

module.exports = User;
