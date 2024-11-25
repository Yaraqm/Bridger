// routes/friends.js
const express = require("express");
const sequelize = require("../config/database");
const { Op } = require("sequelize");
const User = require("../models/user");
const UserRewards = require("../models/userrewards");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware: Authenticate
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

// GET /friends/search
router.get("/search", async (req, res) => {
  const { query } = req.query;

  try {
    console.log("Search query received:", query);

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query cannot be empty." });
    }

    const users = await User.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`,
        },
      },
      attributes: ["user_id", "name", "email"],
    });

    console.log("Users found:", users);
    res.json(users);
  } catch (error) {
    console.error("Error in /friends/search route:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// POST /friends/send
router.post("/send", authenticate, async (req, res) => {
  const { targetUserId } = req.body;
  const userId = req.userId;

  try {
    if (!userId || !targetUserId) {
      return res
        .status(400)
        .json({ message: "User ID and target user ID are required." });
    }

    if (userId === targetUserId) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself." });
    }

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

    if (
      currentUserFriends.includes(String(targetUserId)) ||
      targetUserFriends.includes(String(userId))
    ) {
      return res.status(400).json({ message: "You are already friends." });
    }

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

// GET /friends/requests
router.post("/accept", authenticate, async (req, res) => {
  const { requesterId } = req.body; // Requester (who sent the friend request)
  const userId = req.userId; // Logged-in user (accepting the request)

  try {
    const currentUser = await User.findByPk(userId);
    const requester = await User.findByPk(requesterId);

    if (!currentUser || !requester) {
      return res.status(404).json({ message: "User not found." });
    }

    // Accept the friend request
    const [updatedRows] = await sequelize.query(
      `UPDATE friendrequest SET accepted = 1 WHERE user_id = :requesterId AND friend_id = :userId`,
      { replacements: { requesterId, userId } }
    );

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ message: "Friend request not found or already accepted." });
    }

    console.log("Requester ID:", requesterId);
    console.log("Friend Request Accepted");

    // Update friend lists
    const currentUserFriends = currentUser.friend_user_ids_str
      ? currentUser.friend_user_ids_str.split(",").filter((id) => id)
      : [];
    const requesterFriends = requester.friend_user_ids_str
      ? requester.friend_user_ids_str.split(",").filter((id) => id)
      : [];

    currentUserFriends.push(String(requesterId));
    requesterFriends.push(String(userId));

    await currentUser.update({
      friend_user_ids_str: currentUserFriends.join(","),
    });
    await requester.update({ friend_user_ids_str: requesterFriends.join(",") });

    console.log("Friends list updated for both users.");

    // HARD CODED: Update the requester's total_points
    console.log(
      `Incrementing total_points for user ${requesterId} by 10 (hardcoded)`
    );
    const [hardcodedRowsUpdated] = await sequelize.query(
      `UPDATE user SET total_points = IFNULL(total_points, 0) + 10 WHERE user_id = :userId`,
      { replacements: { userId: requesterId } }
    );

    if (hardcodedRowsUpdated === 0) {
      console.error(`Failed to increment points for user ${requesterId}`);
      return res.status(500).json({ message: "Failed to update points." });
    }

    console.log(`Hardcoded points successfully added for user ${requesterId}`);

    // Return success response
    res.status(200).json({
      message: "Friend request accepted successfully.",
      pointsAwarded: 10, // Hardcoded value
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// POST /friends/decline
router.post("/decline", authenticate, async (req, res) => {
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

module.exports = router;
