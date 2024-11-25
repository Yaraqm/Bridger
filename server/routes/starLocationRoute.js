const express = require('express');
const StarredLocation = require('../models/starredLocation'); // Import the StarredLocation model
const router = express.Router();

// POST: Star and optionally share a venue
router.post('/starred-location', async (req, res) => {
    const { user_id, venue_id, share_with } = req.body;

    // Validate the required fields
    if (!user_id || !venue_id) {
        return res.status(400).json({ message: 'User ID and Venue ID are required.' });
    }

    try {
        const starredLocation = await StarredLocation.create({
            user_id,
            venue_id,
            starred_at: new Date(),
            share_with: share_with || [], // Save share_with as an empty array if not provided
        });

        res.status(201).json({ message: 'Venue starred successfully', starredLocation });
    } catch (err) {
        console.error('Error starring venue:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
