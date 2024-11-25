const express = require('express');
const UserVisitHistory = require('../models/uservisithistory');
const router = express.Router();

// POST: Submit a user visit
router.post('/user-visit', async (req, res) => {
    const { user_id, venue_id, visit_date, notes } = req.body;

    // Validate the required fields
    if (!user_id || !venue_id || !visit_date) {
        return res.status(400).json({ message: 'User ID, Venue ID, and Visit Date are required.' });
    }

    try {
        // Create a new visit record
        const newVisit = await Visit.create({
            user_id,
            venue_id,
            visit_date,
            notes,
        });

        res.status(201).json({ success: true, message: 'Visit successfully recorded', visit: newVisit });
    } catch (err) {
        console.error('Error recording visit:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;