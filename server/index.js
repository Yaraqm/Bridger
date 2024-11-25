// index.js (or server.js)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/userRoutes');
const rewardRoutes = require('./routes/rewards');
const venueRoutes = require('./routes/venueRoutes');
const statsRoute = require('./routes/statsRoute');
const feedbackRoutes = require('./routes/feedbackRoutes');
const starredLocationsRoutes = require('./routes/starLocationRoute');
const userVisitRoute = require('./routes/visitHistoryRoute');
const volunteerRoutes = require('./routes/volunteerRoutes'); // Volunteer-related routes
const venueSubmissionRoutes = require('./routes/venueSubmissionRoute'); // Task-related routes
const friendRoutes = require("./routes/friends");

dotenv.config();  // Load environment variables
const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cors());  // Allow cross-origin requests
app.use(express.json());  // Parse incoming JSON requests

// Routes
app.use('/api/auth', authRoutes);  // All authentication-related routes
app.use('/api/rewards', rewardRoutes);  // All reward-related routes
app.use('/api/venues', venueRoutes); // All venue-related routes
app.use('/api/stats', statsRoute); // All venue-related routes
app.use('/api/feedback', feedbackRoutes); // All venue-related routes
app.use('/api/starred', starredLocationsRoutes);
app.use('/api', userVisitRoute);
app.use("/api/volunteer", volunteerRoutes);
app.use('/api/locationSubmission', venueSubmissionRoutes);
app.use("/api/friends", friendRoutes); // Friend-related routes


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
