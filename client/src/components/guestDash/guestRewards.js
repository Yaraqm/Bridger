import React from 'react';
import Navbar from './GuestNavbar'; 

const Rewards = () => {
  // Static data for reward tiers
  // Each object contains the points required and the reward description
  const redemptionTiers = [
    { points_required: 100, reward_description: 'Earn a $5 giftcard when you redeem 100 points!' },
    { points_required: 200, reward_description: 'Earn a $10 giftcard when you redeem 200 points!' },
    { points_required: 500, reward_description: 'Earn a $25 giftcard when you redeem 500 points!' },
  ];

  // Function to handle the back button click
  // Navigates the user to the previous page in their browser history
  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div style={styles.wrapper}>
      <Navbar /> 
      <div style={styles.content}>
        {/* Main heading of the page */}
        <h1 style={styles.headerTitle}>Rewards</h1>

        {/* Description explaining how users can earn points */}
        <p style={styles.description}>
          Earn points by contributing to our community! Here’s how you can earn points:
        </p>
        <ul style={styles.list}>
          <li>🌟 Leave feedback on a venue to earn <strong>5 points</strong>.</li>
          <li>🌟 Bridge to a new friend to earn <strong>5 points</strong>.</li>
        </ul>

        {/* Additional description for redeeming points */}
        <p style={styles.description}>
          Redeem your points for exciting rewards listed below:
        </p>

        {/* Display redemption tiers or a message if no tiers are available */}
        {redemptionTiers.length === 0 ? (
          <p style={styles.noTiers}>No redemption tiers available at the moment.</p>
        ) : (
          <div style={styles.tiersContainer}>
            {redemptionTiers.map((tier, index) => (
              // Each reward tier is displayed in a styled container
              <div key={index} style={styles.tier}>
                <p style={styles.points}>
                  <strong>{tier.points_required} Points</strong>
                </p>
                <p style={styles.reward}>{tier.reward_description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Styles object for inline styling
const styles = {
  // Wrapper for the entire page with a gradient background
  wrapper: {
    fontFamily: '"Arial", sans-serif',
    color: '#191919',
    background: 'linear-gradient(135deg, #f0f0f5, #cdd5e8)', // Gradient background
    minHeight: '100vh', // Ensures the page fills the viewport height
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  // Header styling, including a solid background color and right-aligned back button
  header: {
    backgroundColor: '#00004A', // Solid header color
    width: '100%',
    padding: '10px 20px',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'flex-end', // Aligns the back button to the right
    alignItems: 'center',
    zIndex: 10, // Ensures the header stays above other content
  },
  // Back button styling
  backButton: {
    backgroundColor: 'transparent', // Transparent background
    border: 'none', // Removes default button border
    fontSize: '1rem',
    color: '#fff', // White text
    cursor: 'pointer', // Pointer cursor on hover
    marginRight: '50px', // Adds spacing to the right
    fontWeight: 'bold',
    padding: '10px 20px',
  },
  // Container for the main content of the page
  content: {
    width: '100%',
    maxWidth: '800px', // Limits the width for better readability
    padding: '20px',
    textAlign: 'center', // Centers text
    backgroundColor: '#FFFF', // White background
    borderRadius: '10px', // Rounded corners
  },
  // Main title styling
  headerTitle: {
    color: '#00004A', // Dark blue text
    fontSize: '40px', // Large font size
    marginBottom: '10px',
  },
  // General description text styling
  description: {
    fontSize: '17px',
    lineHeight: '1.6', // Improves readability with line spacing
    margin: '10px 0',
  },
  // Unordered list styling
  list: {
    listStyleType: 'none', // Removes default bullet points
    padding: '0',
    fontSize: '17px',
    marginBottom: '20px',
  },
  // Container for the reward tiers
  tiersContainer: {
    display: 'flex',
    flexDirection: 'column', // Stack items vertically
    gap: '15px', // Adds spacing between tiers
    alignItems: 'center',
  },
  // Individual tier styling
  tier: {
    backgroundColor: '#FFFF', // White background
    padding: '15px',
    borderRadius: '10px', // Rounded corners
    textAlign: 'center',
    width: '100%', // Ensures consistent size
    maxWidth: '350px', // Limits width for better presentation
  },
  // Points text styling
  points: {
    fontSize: '20px',
    color: '#00004a', // Dark blue text
  },
  // Reward description styling
  reward: {
    fontSize: '16px',
    color: '#00004A',
  },
  // Styling for the "no tiers available" message
  noTiers: {
    fontSize: '18px',
    textAlign: 'center',
    color: '#7f8c8d', // Gray text
  },
};

export default Rewards;
