const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const router = express.Router();

// Endpoint to get stats, including account creation over time
router.get('/stats', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch all users with relevant data
    const users = await User.findAll({
      attributes: ['name', 'email', 'created_at', 'total_points', 'friend_user_ids', 'high_contrast', 'screen_reader', 'keyboard_navigation', 'accessibility_preferences', 'city', 'postal'],
    });

    // Prepare data for the graph (number of users created over time)
    const creationDates = users.map(user => user.created_at);

    // Group by month (or you can choose a different time period)
    const groupedData = {};
    creationDates.forEach(date => {
      const month = date.toISOString().substring(0, 7); // Format: YYYY-MM
      if (groupedData[month]) {
        groupedData[month]++;
      } else {
        groupedData[month] = 1;
      }
    });

    // Convert the grouped data into a format suitable for the frontend (e.g., labels and counts)
    const labels = Object.keys(groupedData);
    const counts = Object.values(groupedData);

    // Send the user data and creation data for the graph
    res.json({
      Users: users,
      creationData: { labels, counts }, // Data for the graph
    });

  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
