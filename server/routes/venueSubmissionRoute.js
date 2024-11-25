const express = require('express');
const LocationSubmission = require('../models/locationSubmission'); // Import the LocationSubmission model
const Venue = require('../models/venue'); // Import the Venue model

const router = express.Router();

// POST route to create a new location submission
router.post('/', async (req, res) => {
    const { location_name, location_address, location_description, location_type, accessibility_score } = req.body;

    try {
        const newSubmission = await LocationSubmission.create({
            location_name,
            location_address,
            location_description,
            location_type,
            accessibility_score,
        });

        res.status(201).json({ message: 'Location created successfully!', location: newSubmission });
    } catch (error) {
        console.error('Error creating location submission:', error.message);
        res.status(500).json({ message: 'Failed to create location submission', error: error.message });
    }
});

// GET route to fetch all location submissions for the admin dashboard
router.get('/', async (req, res) => {
    try {
        const locations = await LocationSubmission.findAll(); // Fetch all submissions
        res.status(200).json(locations);
    } catch (error) {
        console.error('Error fetching locations:', error.message);
        res.status(500).json({ message: 'Failed to fetch location data', error: error.message });
    }
});

// POST route to accept a location submission and add it to the 'venue' table
router.post('/accept/:location_submission_id', async (req, res) => {
    const { location_submission_id } = req.params;

    try {
        const submission = await LocationSubmission.findByPk(location_submission_id);

        if (!submission) {
            return res.status(404).json({ message: 'Location submission not found' });
        }

        // Add the submission to the 'venues' table
        const newVenue = await Venue.create({
            name: submission.location_name,
            address: submission.location_address,
            accessibility_score: submission.accessibility_score,
            type: submission.location_type, // Enum validation should match your DB schema
            description: submission.location_description,
        });

        // Delete the submission from the 'locationsubmission' table
        await submission.destroy();

        res.status(201).json({ message: 'Venue accepted and added successfully', venue: newVenue });
    } catch (error) {
        console.error('Error accepting venue:', error.message);
        res.status(500).json({ message: 'Failed to accept and add venue', error: error.message });
    }
});

// DELETE route to delete a location submission
router.delete('/:location_submission_id', async (req, res) => {
    const { location_submission_id } = req.params;

    try {
        const submission = await LocationSubmission.findByPk(location_submission_id);

        if (!submission) {
            return res.status(404).json({ message: 'Location submission not found' });
        }

        await submission.destroy();
        res.status(200).json({ message: 'Location submission deleted successfully' });
    } catch (error) {
        console.error('Error deleting location submission:', error.message);
        res.status(500).json({ message: 'Failed to delete location submission', error: error.message });
    }
});

module.exports = router;





