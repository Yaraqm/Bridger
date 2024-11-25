import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StarAndShareForm = ({ venueId, userId, friends, onStarSubmit }) => {
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [shareWith, setShareWith] = useState('');
    const [starred, setStarred] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState('');
    const [isVenueStarred, setIsVenueStarred] = useState(false);

    useEffect(() => {
        const checkIfStarred = async () => {
            if (!userId) return;

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
                
                // Ensure response has data
                if (response.data && response.data.starredLocations) {
                    const alreadyStarred = response.data.starredLocations.some(
                        (location) => location.venue.venue_id === venueId
                    );
                    setIsVenueStarred(alreadyStarred); // Set the state if the venue is already starred
                }
            } catch (err) {
                console.error('Error checking starred locations:', err);
            }
        };

        checkIfStarred();
    }, [userId, venueId]);

    // Handle changes to the selected friends list
    const handleFriendChange = (e) => {
        const options = e.target.selectedOptions;
        const selectedValues = Array.from(options).map(option => option.value);
        setSelectedFriends(selectedValues);
    };

    const handleStarSubmit = async () => {
        if (!userId || !venueId) {
            setError('User ID and Venue ID are required.');
            return;
        }

        if (isVenueStarred) {
            setError('You have already starred this venue.'); // Show error if already starred
            return;
        }

        const shareWithArray = selectedFriends.map(id => parseInt(id));

        const starData = {
            user_id: userId,
            venue_id: venueId,
            share_with: shareWithArray,
        };

        try {
            const response = await fetch('/api/starred/starred-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(starData),
            });

            const responseData = await response.json();
            if (response.ok) {
                setStarred(true);
                onStarSubmit(); // Notify parent component that the venue has been starred
            } else {
                setError(responseData.message || 'Failed to star the venue.');
            }
        } catch (err) {
            console.error('Error starring the venue:', err);
            setError('An error occurred while starring the venue.');
        }
    };

    // Button styles
    const buttonStyle = {
        padding: '8px 15px',
        backgroundColor: isVenueStarred ? '#ccc' : '#007bff',  // Change color if already starred
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: isVenueStarred ? 'not-allowed' : 'pointer',  // Disable cursor if already starred
        marginLeft: '0px',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    };


    // Dropdown styles
    const dropdownStyle = {
        display: showDropdown ? 'block' : 'none',
        marginTop: '10px',
    };

    const selectStyle = {
        width: '100%',
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        minHeight: '100px',
    };

    const submitButtonStyle = {
        padding: '8px 15px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    };

    const errorStyle = {
        color: 'red',
        marginTop: '10px',
    };

    return (
        <div>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                disabled={starred}
                style={buttonStyle}
            >
                <span>⭐</span> {starred ? 'Starred' : 'This Venue'}
            </button>
            {showDropdown && (
                <div style={dropdownStyle}>
                    <label htmlFor="shareWith">Share with friends:</label>
                    <select
                        id="shareWith"
                        multiple
                        value={selectedFriends}
                        onChange={handleFriendChange}
                        style={selectStyle}
                    >
                        {friends.map(friend => (
                            <option key={friend.user_id} value={friend.user_id}>
                                {friend.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleStarSubmit} style={submitButtonStyle}>
                        Submit
                    </button>
                </div>
            )}
            {error && <p style={errorStyle}>{error}</p>}
        </div>
    );
};

export default StarAndShareForm;
