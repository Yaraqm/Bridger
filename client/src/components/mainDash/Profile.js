import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import Modal from 'react-modal';
import Navbar from './Navbar'; 

Modal.setAppElement('#root');

const Profile = () => {
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [starredLocations, setStarredLocations] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [visitHistory, setVisitHistory] = useState([]);
    const [redemptionTiers, setRedemptionTiers] = useState([]);
    const [sharedLocations, setSharedLocations] = useState([]);
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('Shared Locations:', response.data.sharedLocations);

                console.log(response.data.Users);
                setUser(response.data.user);
                setTotalPoints(response.data.user.total_points);
                setFriends(response.data.friends);
                setStarredLocations(response.data.starredLocations);
                setVisitHistory(response.data.visitHistory);
                setRedemptionTiers(response.data.redemptionTiers);
                setSharedLocations(response.data.sharedLocations);
            } catch (err) {
                setError('Failed to fetch user data');
                console.error(err);
            }
        };

        fetchUserData();
    }, []);

    const openModal = (content) => {
        setModalContent(content);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setModalContent(null);
    };

    const handleRedeem = async (tier_id, rewardDescription) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No token found');

            const response = await axios.post(
                'http://localhost:5000/api/rewards/redeem',
                { tier_id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Reward redeemed successfully!');
            generatePDF(rewardDescription);

            setTotalPoints(response.data.updatedTotalPoints);
        } catch (err) {
            console.error(err);
            alert('Failed to redeem reward.');
        }
    };

    const generatePDF = (rewardDescription) => {
        const doc = new jsPDF();
    
        // Add a title with larger, bold text and center alignment
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text('Reward Redemption Confirmation', doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });
    
        // Add a horizontal line below the title for separation
        doc.setDrawColor(0, 0, 0); // Black line
        doc.setLineWidth(0.5);
        doc.line(15, 25, doc.internal.pageSize.getWidth() - 15, 25);
    
        // Add a congratulatory message
        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");
        doc.text(`Dear Valued Member,`, 20, 40);
    
        // Add the reward description with bullet-point styling
        doc.setFontSize(14);
        doc.text(`Congratulations! You've redeemed the following reward:`, 20, 50);
        doc.setFont("helvetica", "italic");
        doc.text(`- ${rewardDescription}`, 30, 60); // Indented for better readability
        doc.text(`\n\n\n\nUse this code to redeem this gift card at participating locations: 10098745`, 20, 50);
    
        // Add a thank-you message
        doc.setFont("helvetica", "normal");
        doc.text(`\nThank you for being a valued member of our community!`, 20, 80);
    
        // Add a footer with a small message or branding
        doc.setFontSize(10);
        doc.setTextColor(100); // Grey text for the footer
        doc.text('© 2024 Our Amazing Community - All Rights Reserved', doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
    
        // Save the PDF with a descriptive name
        doc.save('Reward_Redemption_Confirmation.pdf');
    };

    if (error) {
        return <p style={styles.error}>{error}</p>;
    }

    if (!user) {
        return <p style={styles.loading}>Loading...</p>;
    }

    return (
        <div>
            <Navbar style={styles.navbarStyles} />
            <div style={styles.container}>
                
                <h1 style={styles.heading}>Welcome, {user.name}!</h1>
                <div style={styles.profileSection}>
                    <h2 style={styles.subHeading}>Profile Details</h2>
                    <div style={styles.infoCard}>
                        <div style={styles.profileDetailsRow}>
                            <p style={styles.profileLabel}><strong>Email:</strong></p>
                            <p style={styles.profileValue}>{user.email}</p>
                        </div>
                        <div style={styles.profileDetailsRow}>
                            <p style={styles.profileLabel}><strong>Accessibility Preferences:</strong></p>
                            <div style={styles.preferencesContainer}>
                                {user.accessibility_preferences ? (
                                    Object.entries(user.accessibility_preferences).map(([key, value]) => (
                                        <div key={key} style={styles.preferenceRow}>
                                            <p style={styles.preferenceKey}>{key.charAt(0).toUpperCase() + key.slice(1)}:</p>
                                            <p style={value ? styles.enabled : styles.disabled}>
                                                {value ? '✔ Enabled' : '✘ Disabled'}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p style={styles.noPreferences}>No preferences set</p>
                                )}
                            </div>
                        </div>
                        <div style={styles.profileDetailsRow}>
                            <p style={styles.profileLabel}><strong>Proud Member Since:</strong></p>
                            <p style={styles.profileValue}>{new Date(user.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>


                <div style={styles.profileSection}>
                    <h2 style={styles.subHeading}>Friends</h2>
                    {friends.length > 0 ? (
                        <div style={styles.scrollableBox}>
                            {friends.map((friend) => (
                                <div key={friend.user_id} style={styles.friendCard}>
                                    <p><strong>Name:</strong> {friend.name}   <strong>Email:</strong> {friend.email}</p>
                                    <p><strong>Member Since:</strong> {new Date(friend.created_at).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={styles.info}>No friends listed.</p>
                    )}
                </div>

                <div style={styles.profileSection}>
                    <h2 style={styles.subHeading}>Starred Locations</h2>
                    {starredLocations.length > 0 ? (
                        <div style={styles.scrollableBox}>
                            {starredLocations.map((location) => (
                                <div key={location.venue.venue_id} style={styles.locationCard}>
                                    <p style={styles.locationName}>{location.venue.name}</p>
                                    <button
                                        style={styles.infoButton}
                                        onClick={() => openModal(location.venue)}
                                    >
                                        See Info
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={styles.info}>No starred locations.</p>
                    )}
                </div>

                <div style={styles.profileSection}>
                    <h2 style={styles.subHeading}>Locations Shared With You</h2>
                    {sharedLocations.length > 0 ? (
                        <div style={styles.scrollableBox}>
                            {sharedLocations.map((location) => {
                                // Find the friend who shared the location by user_id
                                const sharedBy = friends.find(friend => friend.user_id === location.shared_by);

                                return (
                                    <div key={location.venue.venue_id} style={styles.locationCard}>
                                        <p><strong>Venue Name:</strong> {location.venue.name}</p>
                                        <p><strong>Starred At:</strong> {new Date(location.starred_at).toLocaleString()}</p>
                                        <button
                                            style={styles.infoButton}
                                            onClick={() => openModal(location.venue)}
                                        >
                                            See Info
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p style={styles.info}>No locations shared with you.</p>
                    )}
                </div>

                <div style={styles.profileSection}>
                    <h2 style={styles.subHeading}>Visit History</h2>
                    {visitHistory.length > 0 ? (
                        <div style={styles.scrollableBox}>
                            {visitHistory.map((visit) => (
                                <div key={visit.visit_id} style={styles.locationCard}>
                                    <p style={styles.locationName}>{visit.Venue.name}</p>
                                    <button
                                        style={styles.infoButton}
                                        onClick={() => openModal(visit.Venue)}
                                    >
                                        See Info
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={styles.info}>No visit history available.</p>
                    )}
                </div>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Venue Details"
                    style={modalStyles}
                >
                    {modalContent && (
                        <div>
                            <h2>{modalContent.name}</h2>
                            <p><strong>Address:</strong> {modalContent.address}</p>
                            <p><strong>Type:</strong> {modalContent.type}</p>
                            <p><strong>Description:</strong> {modalContent.description}</p>
                            {modalContent.starred_at && (
                                <p><strong>Starred At:</strong> {new Date(modalContent.starred_at).toLocaleString()}</p>
                            )}
                            <button onClick={closeModal} style={styles.closeButton}>
                                Close
                            </button>
                        </div>
                    )}
                </Modal>

                <div style={styles.profileSection}>
                    <h2 style={styles.subHeading}>Rewards</h2>
                    <div style={styles.infoCard}>
                        <p><strong>Total Points Earned:</strong> {totalPoints}</p>
                    </div>
                </div>

                <div style={styles.profileSection}>
                    <h2 style={styles.subHeading}>Redemption Tiers</h2>
                    {redemptionTiers.length > 0 ? (
                        redemptionTiers.map((tier) => {
                            const canRedeem = totalPoints >= tier.points_required; // Check if user has enough points
                            return (
                                <div key={tier.tier_id} style={styles.rewardCard}>
                                    <p><strong>Reward:</strong> {tier.reward_description}</p>
                                    <p><strong>Points Required:</strong> {tier.points_required}</p>
                                    <button
                                        onClick={() => canRedeem && handleRedeem(tier.tier_id, tier.reward_description)}
                                        style={{
                                            ...styles.redeemButton,
                                            ...(canRedeem ? styles.redeemButtonActive : styles.redeemButtonDisabled),
                                        }}
                                        disabled={!canRedeem} // Disable the button if the user can't redeem
                                    >
                                        {canRedeem ? 'Redeem' : 'Not Enough Points'}
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <p style={styles.info}>No rewards available.</p>
                    )}
                </div>

            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Raleway, sans-serif',
        color: '#191919',
        backgroundColor: '#ffffff',
        margin: '0 auto',
        padding: '20px',
        maxWidth: '900px',
    },
    navbarStyles: {
        width: '100%',
        position: 'relative',
        top: 0,
        left: 0,
        backgroundColor: '#00004a', // Example background color
        paddingRight: '10px',
        color: '#fff',
        padding: '10px 20px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        textAlign: 'center',
        color: '#00004a', // Dark blue
        fontSize: '32px',
    },
    profileDetailsRow: {
        marginBottom: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    profileLabel: {
        fontWeight: 'bold',
        marginBottom: '8px',
        color: '#2d2d2d',
        fontSize: '16px', // Slightly larger font size
    },
    preferencesContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '12px 20px', // Added padding
        backgroundColor: '#f9f9f9',
    },
    preferenceRow: {
        display: 'flex',
        alignItems: 'center',
        minWidth: '150px',
    },
    preferenceKey: {
        fontWeight: '500',
        marginRight: '10px',
        color: '#333',
    },
    enabled: {
        color: 'green',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
    disabled: {
        color: 'red',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
    noPreferences: {
        fontStyle: 'italic',
        color: '#888',
    },
    subHeading: {
        color: '#9e44da', // Purple
        fontSize: '24px',
        marginBottom: '10px',
    },
    profileSection: {
        marginBottom: '30px', // Adjusted for space between sections
    },
    subHeading: {
        fontSize: '1.75rem', // Adjusted size for better readability
        color: '#9e44da', // Soft purple for a modern look
        fontWeight: '600',
        marginBottom: '20px',
    },
    infoCard: {
        backgroundColor: '#ffffff',
        padding: '20px', // Increased padding for a better spacious look
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Softer shadow for a modern touch
        border: '1px solid #cdd5e8', // Light border for subtle structure
    },
    profileDetailsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px', // Reduced spacing between rows
    },
    profileLabel: {
        fontSize: '1rem', // Slightly smaller text for labels
        color: '#00004a', // Dark blue for labels for contrast
        fontWeight: '500',
        flex: 1, // Ensures the label stays on the left
    },
    profileValue: {
        fontSize: '0.9rem', // Slightly smaller font size for values
        color: '#191919', // Dark gray for text for easy readability
        fontWeight: '400',
        flex: 2, // Ensures the value takes up the rest of the space
        wordWrap: 'break-word', // Prevents overflow for longer text
    },
    locationCard: {
        backgroundColor: '#fff',
        border: '3px solid #cdd5e8', // Light purple border
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    locationName: {
        fontWeight: 'bold',
        fontSize: '18px',
    },
    scrollableBox: {
        maxHeight: '300px',
        overflowY: 'auto',
        marginTop: '10px',
    },
    info: {
        fontStyle: 'italic',
        color: '#777',
    },
    friendCard: {
        backgroundColor: '#FFF',
        border: '3px solid #cdd5e8',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '10px',
    },
    rewardCard: {
        backgroundColor: '#FFF',
        border: '3px solid #cdd5e8',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '10px',
    },
    redeemButton: {
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    redeemButtonActive: {
        backgroundColor: '#f5906e', // Soft orange 
        color: '#fff',
    },
    redeemButtonDisabled: {
        backgroundColor: '#ccc', 
        color: '#666',
        cursor: 'not-allowed', 
    },
    infoButton: {
        backgroundColor:'#00004a', // Light lavender
        fontWeight: 'bold',
        color: '#acd2ed',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    closeButton: {
        backgroundColor: '#9e44da', // Purple
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    modalStyles: {
        content: {
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '600px',
            margin: '0 auto',
        },
    },
    loading: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#f5906e',
    },
    error: {
        color: 'red',
        fontSize: '18px',
        textAlign: 'center',
    },
};

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        maxWidth: '500px',
        borderRadius: '8px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    },
};

export default Profile;
