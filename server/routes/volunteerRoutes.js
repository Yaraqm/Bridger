const express = require('express');
const Volunteer = require('../models/volunteer');

const router = express.Router();

// POST route to handle form submissions and create a new volunteer
router.post('/', async (req, res) => {
    console.log("Incoming volunteer application request");
    console.log("Request Body: ", req.body);

    const { volunteerName, availability, skills, certifications, contact_number, email, areas_of_interest } = req.body;

    try {
        // Create a new volunteer in the database
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

        res.status(201).json({ message: "Volunteer created successfully!", volunteer: newVolunteer });
    } catch (error) {
        console.error("Error creating volunteer:", error);
        res.status(500).json({ message: "Failed to create volunteer application", error });
    }
});

// GET route to fetch all volunteers for the admin dashboard
router.get('/', async (req, res) => {
    try {
        const volunteers = await Volunteer.findAll();
        res.status(200).json(volunteers);  // Send the volunteer data as JSON
    } catch (error) {
        console.error("Error fetching volunteers:", error);
        res.status(500).json({ message: "Failed to fetch volunteers", error });
    }
});

module.exports = router;
