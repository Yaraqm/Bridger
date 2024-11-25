const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Volunteer = sequelize.define(
    'Volunteer',
    {
        // Explicitly define the 'id' column
        id: { 
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        volunteerName: { type: DataTypes.STRING, allowNull: false },
        availability: { type: DataTypes.STRING },
        skills: { type: DataTypes.STRING },
        certifications: { type: DataTypes.STRING },
        contact_number: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        areas_of_interest: { type: DataTypes.STRING },
        application_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
        tableName: 'Volunteers',
        timestamps: true, // Automatically adds createdAt and updatedAt
        indexes: [
            {
                unique: true,
                fields: ['contact_number', 'email'], // Composite unique constraint
            },
        ],
    }
);

// Remove the default 'id' field created by Sequelize if necessary (no longer required with the explicit id definition)
Volunteer.removeAttribute('id'); // This will not be needed now, as we've explicitly defined it

module.exports = Volunteer;
