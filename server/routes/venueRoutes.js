const express = require('express');
const jwt = require('jsonwebtoken');
const Venue = require('../models/venue');
const Feedback = require('../models/feedback'); // Import the Feedback model
const router = express.Router();

// GET /api/venues - Fetch all venues
router.get('/', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in the .env file');
      return res.status(500).json({ message: 'Internal server error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const venues = await Venue.findAll();

    res.json({ venues });
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});



module.exports = router;
