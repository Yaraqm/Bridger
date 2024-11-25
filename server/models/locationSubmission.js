const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LocationSubmission = sequelize.define('LocationSubmission', {
    location_submission_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    location_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    location_address: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    location_description: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    location_type: { 
        type: DataTypes.STRING(100), 
        allowNull: false 
    },
    accessibility_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
}, {
    tableName: 'locationsubmission',
    timestamps: false,
});

module.exports = LocationSubmission;









