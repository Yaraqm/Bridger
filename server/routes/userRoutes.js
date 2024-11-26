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
const { Op } = require('sequelize');


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
  const { name, email, password, accessibility_preferences } = req.body; // Ensure accessibility_preferences is included

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
      region: zip, // Save the zip code into the `region` column
      accessibility_preferences: accessibility_preferences || {
        mobility: false,
        sensory: false,
        navigation: false,
        health: false,
      }, // Default preferences if none provided
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
        'city',
        'postal',
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    let friends = [];
    if (user.friend_user_ids_str) {
      const friendIds = user.friend_user_ids_str.split(',').map(id => id.trim()); // Parse the IDs
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

router.get("/friends/search", async (req, res) => {
  const { query } = req.query;

  try {
    console.log("Search query received:", query);

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query cannot be empty." });
    }

    // Query the database
    const users = await User.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`, // Use Op.like for SQL LIKE queries
        },
      },
      attributes: ["user_id", "name", "email"], // Return only relevant fields
    });

    console.log("Users found:", users);
    res.json(users); // Send the result back to the frontend
  } catch (error) {
    console.error("Error in /friends/search route:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// POST /friends/send (send friend request)
router.post("/friends/send", authenticate, async (req, res) => {
  const { targetUserId } = req.body;
  const userId = req.userId;

  try {
    if (!userId || !targetUserId) {
      return res
        .status(400)
        .json({ message: "User ID and target user ID are required." });
    }

    // Prevent sending a friend request to yourself
    if (userId === targetUserId) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself." });
    }

    // Fetch the current user and target user
    const currentUser = await User.findByPk(userId);
    const targetUser = await User.findByPk(targetUserId);

    if (!currentUser || !targetUser) {
      return res
        .status(404)
        .json({ message: "User not found or invalid target user." });
    }

    const currentUserFriends = currentUser.friend_user_ids_str
      ? currentUser.friend_user_ids_str.split(",").filter((id) => id)
      : [];
    const targetUserFriends = targetUser.friend_user_ids_str
      ? targetUser.friend_user_ids_str.split(",").filter((id) => id)
      : [];

    // Check if already friends
    if (
      currentUserFriends.includes(String(targetUserId)) ||
      targetUserFriends.includes(String(userId))
    ) {
      return res.status(400).json({ message: "You are already friends." });
    }

    // Check if a pending friend request already exists
    const existingRequest = await sequelize.query(
      `
      SELECT * FROM friendrequest
      WHERE (user_id = :userId AND friend_id = :targetUserId AND accepted = 0)
      OR (user_id = :targetUserId AND friend_id = :userId AND accepted = 0)
      `,
      {
        replacements: { userId, targetUserId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (existingRequest.length > 0) {
      return res
        .status(400)
        .json({ message: "A pending friend request already exists." });
    }

    // Create a new friend request
    await sequelize.query(
      `
      INSERT INTO friendrequest (user_id, friend_id, requested_at, accepted)
      VALUES (:userId, :targetUserId, NOW(), 0)
      `,
      { replacements: { userId, targetUserId } }
    );

    res.status(200).json({ message: "Friend request sent successfully." });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res
      .status(500)
      .json({ message: "Internal server error while sending friend request." });
  }
});

// GET /friends/requests (fetch pending friend requests)
router.get("/friends/requests", authenticate, async (req, res) => {
  const userId = req.userId;

  try {
    // Query to get pending friend requests sent to the current user
    const friendRequests = await sequelize.query(
      `
      SELECT fr.user_id AS user_id, u.name AS name, u.email AS email, fr.requested_at
      FROM friendrequest fr
      JOIN user u ON fr.user_id = u.user_id
      WHERE fr.friend_id = :userId AND fr.accepted = 0
      `,
      { type: sequelize.QueryTypes.SELECT, replacements: { userId } }
    );

    res.status(200).json({ requests: friendRequests });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({
      message: "Internal server error while fetching friend requests.",
    });
  }
});

// POST /friends/accept (accept friend request)
router.post("/friends/accept", authenticate, async (req, res) => {
  const { requesterId } = req.body;
  const userId = req.userId;

  try {
    const currentUser = await User.findByPk(userId);
    const requester = await User.findByPk(requesterId);

    if (!currentUser || !requester) {
      return res.status(404).json({ message: "User not found." });
    }

    // Mark the request as accepted
    const [updatedRows] = await sequelize.query(
      `
      UPDATE friendrequest
      SET accepted = 1
      WHERE user_id = :requesterId AND friend_id = :userId
      `,
      { replacements: { requesterId, userId } }
    );

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ message: "Friend request not found or already accepted." });
    }

    const currentUserFriends = currentUser.friend_user_ids || [];
    const requesterFriends = requester.friend_user_ids || [];

    // Add each other to friend lists (only add if not already in the list)
    if (!currentUserFriends.includes(requesterId)) {
      currentUserFriends.push(requesterId);
    }
    if (!requesterFriends.includes(userId)) {
      requesterFriends.push(userId);
    }

    // Update the users' friend_user_ids column with the new lists
    await currentUser.update({
      friend_user_ids: currentUserFriends,
    });
    await requester.update({
      friend_user_ids: requesterFriends,
    });

    res.status(200).json({ message: "Friend request accepted successfully." });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// POST /friends/decline (decline friend request)
router.post("/friends/decline", authenticate, async (req, res) => {
  const { requesterId } = req.body;
  const userId = req.userId;

  try {
    const [deletedRows] = await sequelize.query(
      `
      DELETE FROM friendrequest
      WHERE user_id = :requesterId AND friend_id = :userId
      `,
      { replacements: { requesterId, userId } }
    );

    if (deletedRows === 0) {
      return res
        .status(404)
        .json({ message: "Friend request not found or already declined." });
    }

    res.status(200).json({ message: "Friend request declined successfully." });
  } catch (error) {
    console.error("Error declining friend request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


module.exports = router;  // Export the router to use in the main server file
