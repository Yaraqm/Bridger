const Volunteer = require('../models/volunteer');

// Create a new volunteer
exports.createVolunteer = async (req, res) => {
    const {
        volunteerName,
        availability,
        skills,
        certifications,
        contact_number,
        email,
        areas_of_interest
    } = req.body;

    try {
        // Create a new volunteer entry
        const newVolunteer = await Volunteer.create({
            volunteerName,
            availability,
            skills,
            certifications,
            contact_number,
            email,
            areas_of_interest,
            application_date: new Date(),
        });

        res.status(201).json({ message: 'Volunteer application submitted successfully!', volunteer: newVolunteer });
    } catch (error) {
        console.error('Error creating volunteer:', error);
        res.status(500).json({ message: 'Failed to create volunteer application', error });
    }
};

// Get all volunteers for the admin dashboard
exports.getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.findAll();  // Fetch all volunteers
        res.status(200).json(volunteers);  // Send the volunteer data as response
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        res.status(500).json({ message: 'Failed to fetch volunteer data', error });
    }
};

module.exports = { createVolunteer, getAllVolunteers };

