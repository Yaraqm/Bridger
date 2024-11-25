const express = require('express');
const jwt = require('jsonwebtoken');
const Venue = require('../models/venue');
const Feedback = require('../models/feedback'); // Import the Feedback model
const User = require('../models/user');
const UserReward = require('../models/userrewards');
const router = express.Router();

// POST: Add feedback for a venue
router.post('/feedback', async (req, res) => {
    const { user_id, venue_id, content, accessibility_score } = req.body;
    console.log("Received feedback data:", req.body);

    if (!user_id || !venue_id || !content || !accessibility_score) {
        return res.status(400).send('Missing required fields');
    }

    try {
        // Fetch points associated with 'leave_feedback' activity type
        const reward = await UserReward.findOne({
            where: { activity_type: 'leave_feedback' },
        });

        if (!reward) {
            return res.status(400).json({ message: 'Reward points for leave_feedback not found' });
        }

        const pointsToAdd = reward.points_associated;

        const feedback = await Feedback.create({
            user_id,
            venue_id,
            content,
            accessibility_score,
        });

        // Fetch the user to update their total points
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user points
        const updatedPoints = (user.total_points || 0) + pointsToAdd;
        console.log(`User's total points before update: ${user.total_points}`);
        console.log(`Points to add: ${pointsToAdd}`);

        user.total_points = updatedPoints;

        // Save the updated user data
        await user.save();
        console.log('User points updated:', updatedPoints);

        res.status(201).json({ message: 'Feedback submitted', feedback });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET feedback for a specific venue
router.get('/:venueId', async (req, res) => {
  const venueId = req.params.venueId;

  // Log the incoming request and venueId
  console.log(`Received request to fetch feedback for venueId: ${venueId}`);

  try {
    // Log the query to fetch feedback
    console.log(`Querying database for feedback where venue_id = ${venueId}`);

    // Fetch feedback for the given venueId
    const feedback = await Feedback.findAll({
      where: { venue_id: venueId },
      order: [['created_at', 'DESC']], // Optional: Sort by creation date
    });

    // Log the retrieved feedback
    console.log(`Fetched feedback for venueId ${venueId}:`, feedback);

    // Return the feedback data as JSON
    res.json({ feedback });
  } catch (err) {
    // Log the error details for debugging
    console.error('Error fetching feedback:', err);
    res.status(500).json({ error: 'Failed to fetch feedback data' });
  }
});

module.exports = router;
