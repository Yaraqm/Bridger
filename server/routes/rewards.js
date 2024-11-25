const express = require('express');
const jwt = require('jsonwebtoken');
const sequelize = require('sequelize'); // Import Sequelize for database functions
const RedemptionTier = require('../models/redemptiontiers'); // RedemptionTier model
const User = require('../models/user'); // User model
const router = express.Router();


// Function to extract the user from the token
const extractUserFromToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Authorization token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT_SECRET
    return decoded.userId; // Use userId instead of user_id
};

// Endpoint to redeem a reward
router.post('/redeem', async (req, res) => {
    try {
        // Extract userId from token
        const user_id = extractUserFromToken(req);

        console.log('Extracted user_id:', user_id); // Log user_id for debugging

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is missing' });
        }

        const { tier_id } = req.body;

        console.log('Received tier_id:', tier_id); // Log tier_id for debugging

        if (!tier_id) {
            return res.status(400).json({ error: 'tierId is required' });
        }

        // Fetch the redemption tier details using the RedemptionTier model
        const tier = await RedemptionTier.findOne({
            where: { tier_id: tier_id },
        });

        if (!tier) {
            return res.status(404).json({ error: 'Redemption tier not found' });
        }

        console.log('Points required for redemption:', tier.points_required);

        // Fetch the user's total points from the users table
        const user = await User.findOne({ where: { user_id: user_id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const totalPoints = user.total_points || 0;

        console.log('User total points:', totalPoints);

        if (totalPoints < tier.points_required) {
            return res.status(400).json({ error: 'Insufficient points for redemption' });
        }

        // Deduct points from the user's total_points
        const pointsToDeduct = tier.points_required; // Ensure we use the correct value
        await User.update(
            { total_points: sequelize.literal(`total_points - ${pointsToDeduct}`) },
            { where: { user_id: user_id } }
        );

        console.log(`Successfully deducted ${pointsToDeduct} points from user ${user_id}`);

        // Fetch the updated total points after deduction
        const updatedUser = await User.findOne({ where: { user_id: user_id } });

        res.json({
            message: 'Reward redeemed successfully!',
            reward: tier.reward_description,
            updatedTotalPoints: updatedUser.total_points, // Send updated points back
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});


module.exports = router;
