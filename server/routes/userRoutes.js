// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const StarredLocation = require('../models/starredLocation');
const Venue = require('../models/venue');
const UserRewards = require('../models/userrewards');
const UserVisitHistory = require('../models/uservisithistory');
const sequelize = require('../config/database');
const RedemptionTier = require('../models/redemptiontiers');
const router = express.Router(); // Use Router to handle routes
const fetch = require('node-fetch');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Authorization header missing or malformed");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debugging
    req.userId = decoded.userId; // Attach userId to the request
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// POST /login route for logging in
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Incoming login request:', req.body);

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password in the DB
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token using the secret from .env
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in the .env file');
      return res.status(500).json({ message: 'Internal server error' });
    }

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /register route for registering new users
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Get user's IP address
    let userIp =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      "127.0.0.1";
    console.log("User IP Address:", userIp);

    let geoData = { city: "Unknown", zip: "Unknown" };

    // Fetch geolocation data for public IPs
    if (!userIp || userIp === "127.0.0.1" || userIp === "::1") {
      console.warn("Localhost detected. Using fallback IP.");
      userIp = ""; // Leave empty to let the API auto-detect the IP
    }

    try {
      const apiUrl = `http://ip-api.com/json/${userIp}`;
      console.log("Fetching geolocation data from:", apiUrl);

      const geoResponse = await fetch(apiUrl);
      geoData = await geoResponse.json();

      console.log("Geolocation API Response:", geoData);

      if (geoData.status !== "success") {
        console.warn("Geolocation failed or returned reserved range.");
        geoData.city = "Unknown";
        geoData.zip = "Unknown";
      }
    } catch (geoError) {
      console.error("Error fetching geolocation data:", geoError.message);
    }

    const city = geoData.city || "Unknown";
    const zip = geoData.zip || "Unknown";

    // Log values before saving to database
    console.log("City:", city);
    console.log("ZIP Code:", zip);

    // Create the user
    const user = await User.create({
      name,
      email,
      password_hash: hashedPassword,
      city,
      region: zip, // Save the zip code into the region column
    });

    res.status(201).json({ message: "User registered successfully!", user });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/admin/users", authenticate, async (req, res) => {
  try {
    // Add admin authentication check here if needed
    const users = await User.findAll({
      attributes: ["user_id", "name", "email", "city", "region", "created_at"],
    });

    res.json(users);
  } catch (err) {
    console.error("Error fetching users for admin:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Verify token
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in the .env file');
      return res.status(500).json({ message: 'Internal server error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user details
    const user = await User.findByPk(decoded.userId, {
      attributes: [
        'user_id',
        'name',
        'email',
        'friend_user_ids',
        'accessibility_preferences',
        'high_contrast',
        'screen_reader',
        'keyboard_navigation',
        'created_at',
        'friend_user_ids_str',
        'total_points',
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch user's friends if applicable
    let friends = [];
    if (user.friend_user_ids) {
      const friendIds = user.friend_user_ids;
      friends = await User.findAll({
        where: { user_id: friendIds },
        attributes: ['user_id', 'name', 'email', 'created_at'],
      });
    }

    const starredLocations = await StarredLocation.findAll({
      where: { user_id: user.user_id },
      include: {
        model: Venue,
        attributes: ['venue_id', 'name', 'address', 'type', 'description'],
      },
    });

    // Map over the starredLocations and ensure Venue data is properly extracted
    const starredLocationDetails = starredLocations.map(location => {
      const venue = location.Venue ? location.Venue.get({ plain: true }) : null;
      return {
        venue,
        starred_at: location.starred_at
      };
    });

    console.log('Shared Locations Raw:', await StarredLocation.findAll());


    // Fetch locations shared with the user
    const sharedLocations = await StarredLocation.findAll({
      where: sequelize.literal(`JSON_CONTAINS(share_with, '"${user.user_id.toString()}"')`),
      include: {
        model: Venue,
        attributes: ['venue_id', 'name', 'address', 'type', 'description'],
      },
    });

    const sharedLocationDetails = sharedLocations.map(location => {
      const venue = location.Venue ? location.Venue.get({ plain: true }) : null;
      return {
        venue,
        starred_at: location.starred_at,
      };
    });

    // Fetch visit history
    const visitHistory = await UserVisitHistory.findAll({
      where: { user_id: user.user_id },
      include: {
        model: Venue,
        attributes: ['name', 'address', 'type', 'description'],
      },
      order: [['visit_date', 'DESC']],
    });

    const redemptionTiers = await RedemptionTier.findAll({
      order: [['points_required', 'ASC']],
    });

    // Combine data into response
    res.json({
      user: user.toJSON(),
      friends,
      starredLocations: starredLocationDetails,
      sharedLocations: sharedLocationDetails,
      visitHistory,
      redemptionTiers,
    });
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});


module.exports = router;  // Export the router to use in the main server file