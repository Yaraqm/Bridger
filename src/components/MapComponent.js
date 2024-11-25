import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import FeedbackForm from './FeedbackForm'; 
import StarAndShareForm from './StarLocationForm';
import VisitForm from './VisitForm';

const VenuePage = () => {
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [venues, setVenues] = useState([]);
    const [filteredVenues, setFilteredVenues] = useState([]);
    const [error, setError] = useState('');
    const [markers, setMarkers] = useState([]);
    const [activeMarker, setActiveMarker] = useState(null);
    const [map, setMap] = useState(null);
    const [selectedType, setSelectedType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [feedback, setFeedback] = useState([]);
    const [activeVenueId, setActiveVenueId] = useState(null);
    const [visitSubmitted, setVisitSubmitted] = useState(false);
    
    const venueTypes = [
        'foodservices', 'artsandculture', 'retail', 'grocery', 'nature', 'tourism', 'recreation'
    ];

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get('http://localhost:5000/api/venues', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log(response.data); // Inspect the response structure
                setVenues(response.data.venues);
                setFilteredVenues(response.data.venues);
            } catch (err) {
                setError('Failed to fetch venue data');
                console.error(err);
            }
        };

        fetchVenues();

        // Fetch user data from the server
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('No token found');
                }

                // Get user data from the server
                const response = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data.user); // Update user state with fetched data
                setFriends(response.data.friends);
            } catch (err) {
                setError('Failed to fetch user data');
                console.error(err);
            }
        };

        fetchUserData();

    }, []);

    const filterVenues = () => {
        let filtered = venues;

        if (selectedType) {
            filtered = filtered.filter(venue => venue.type === selectedType);
        }

        if (searchQuery) {
            filtered = filtered.filter(venue =>
                venue.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredVenues(filtered);
    };

     // Google Map settings
     const mapStyles = {
        width: '100%',
        height: '400px',
    };


    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        filterVenues();
    }, [selectedType, searchQuery, venues]);

    // Handle the success of a visit submission
    const handleVisitSubmit = () => {
        setVisitSubmitted(true);
        // Optionally, you can perform additional actions after a successful visit submission
    };
    

    const renderStars = (score) => {
        const totalStars = 5;
        const filledStars = Math.round(score);
        const emptyStars = totalStars - filledStars;

        return (
            <div style={styles.starRating}>
                {[...Array(filledStars)].map((_, index) => (
                    <span key={`filled-${index}`} style={styles.filledStar}>★</span>
                ))}
                {[...Array(emptyStars)].map((_, index) => (
                    <span key={`empty-${index}`} style={styles.emptyStar}>★</span>
                ))}
            </div>
        );
    };

    const handleAddMarker = (venue) => {
        const newMarker = {
            lat: parseFloat(venue.latitude),
            lng: parseFloat(venue.longitude),
            title: venue.name,
        };
    
        // Check if the marker for the venue already exists
        setMarkers((prevMarkers) => {
            const markerExists = prevMarkers.some(
                (marker) => marker.lat === newMarker.lat && marker.lng === newMarker.lng
            );
    
            if (markerExists) {
                // If marker exists, remove it
                return prevMarkers.filter(
                    (marker) => marker.lat !== newMarker.lat || marker.lng !== newMarker.lng
                );
            } else {
                // If marker does not exist, add it
                return [...prevMarkers, newMarker];
            }
        });
    };

    
    const fetchFeedback = async (venueId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`http://localhost:5000/api/feedback/${venueId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('API Response:', response.data);
    
            setFeedback(response.data.feedback || []); // Default to empty array
            setActiveVenueId(venueId); // Set the active venue
        } catch (err) {
            console.error('Error fetching feedback:', err);
            setFeedback([]); // Set to empty array on error
        }
    };
    

    const handleVenueClick = (venueId) => {
        if (activeVenueId === venueId) {
            // Close feedback if the same venue is clicked again
            console.log('Clicked Venue ID:', venueId);
            setActiveVenueId(null);
            setFeedback([]);
        } else {
            fetchFeedback(venueId);
        }
    };

    const handleFeedbackSubmitSuccess = () => {
        // Refresh feedback after a successful submission
        if (activeVenueId) fetchFeedback(activeVenueId);
    };

    if (error) {
        return <p style={styles.error}>{error}</p>;
    }

    if (!filteredVenues.length) {
        return <p style={styles.loading}>Loading venues...</p>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Venue List</h1>

            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search for a venue..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={styles.searchInput}
                />
            </div>

            <div style={styles.filterContainer}>
                <label style={styles.filterLabel}>Filter by Type: </label>
                <select style={styles.filterSelect} onChange={handleTypeChange} value={selectedType}>
                    <option value="">All</option>
                    {venueTypes.map((type) => (
                        <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <LoadScript googleMapsApiKey={"AIzaSyDTqDNf0vURy8uZLTZo7mtp9QmbuCxkSlQ"}>
                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={12}
                    center={{
                        lat: filteredVenues[0]?.latitude || 43.7,
                        lng: filteredVenues[0]?.longitude || -78.9,
                    }}
                    onLoad={(mapInstance) => setMap(mapInstance)}
                >
                    {markers.map((marker, index) => (
                        <Marker
                            key={index}
                            position={{ lat: marker.lat, lng: marker.lng }}
                            title={marker.title}
                            onMouseOver={() => setActiveMarker(marker)}
                            onMouseOut={() => setActiveMarker(null)}
                        >
                            {activeMarker === marker && (
                                <InfoWindow position={{ lat: marker.lat, lng: marker.lng }}>
                                    <div>
                                        <h3>{marker.title}</h3>
                                    </div>
                                </InfoWindow>
                            )}
                        </Marker>
                    ))}
                </GoogleMap>
            </LoadScript>

            <div style={styles.venueList}>
                {filteredVenues.map((venue) => (
                    <div key={venue.venue_id} style={styles.venueCard}>
                        <h3 style={styles.venueName}>
                            {venue.name}
                        </h3>
                    
                        <div style={{ ...styles.tag, backgroundColor: styles.tagColors[venue.type] }}>
                            {venue.type.charAt(0).toUpperCase() + venue.type.slice(1)}
                        </div>
                    
                        <p style={styles.venueDescription}><strong>Description:</strong> {venue.description}</p>
                        <p style={styles.venueAddress}><strong>Address:</strong> {venue.address}</p>
                    
                        <p style={styles.accessibilityScore}>
                            <strong>Accessibility Score:</strong> {renderStars(venue.accessibility_score)}
                        </p>

                        <div style={styles.buttonContainer}>
                    
                            <button
                                style={styles.addButton}
                                onClick={() => handleAddMarker(venue)}
                            >
                                {markers.some(marker => marker.title === venue.name) ? "Marker Added" : "Add Marker"}
                            </button>

                            {/* Existing Feedback Button */}
                            <button
                                style={styles.feedbackButton}
                                onClick={() => handleVenueClick(venue.venue_id)}
                            >
                                {activeVenueId === venue.venue_id ? "Hide Feedback" : "View Feedback"}
                            </button>

                            {user && (
                                <VisitForm
                                    venueId={venue.venue_id}
                                    userId={user.user_id}
                                    onVisitSubmit={handleVisitSubmit}
                                />
                            )} 

                            {/* Add Star and Share Form below */}
                            {user && (
                                <StarAndShareForm
                                    venueId={venue.venue_id}
                                    userId={user.user_id}
                                    friends={friends}
                                    onStarSubmit={() => {
                                        console.log(`Venue ${venue.venue_id} starred successfully.`);
                                    }}
                                />
                            )}
                        </div>
                    
                        {/* Existing Feedback Section */}
                        {activeVenueId === venue.venue_id && (
                            <div>
                            <h4>Feedback:</h4>
                            {feedback.map((fb) => (
                                <div key={fb.feedback_id}>
                                    <p>{fb.content}</p>
                                </div>
                            ))}
                            <FeedbackForm
                                venueId={venue.venue_id}
                                userId={user.user_id}
                                onFeedbackSubmit={handleFeedbackSubmitSuccess}
                            />
                        </div>
                        )}

                        
                    </div>
                
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f8f8f8',
    },
    addVisitButton: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',

    },    
    heading: {
        fontSize: '2em',
        marginBottom: '20px',
    },
    venueList: {
        display: 'flex',
        flexWrap: 'wrap',  // To allow wrapping of venue cards
        gap: '20px',
    },
    venueCard: {
        padding: '15px',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        width: 'calc(33.33% - 20px)',  // 3 venues per row
        boxSizing: 'border-box',
    },
    venueName: {
        fontSize: '1.5em',
        fontWeight: 'bold',
    },
    venueDescription: {
        fontSize: '1em',
        color: '#555',
        marginBottom: '10px',
    },
    venueAddress: {
        fontSize: '1em',
        color: '#777',
    },
    accessibilityScore: {
        fontSize: '1.2em',
        color: '#333',
        marginBottom: '10px',
    },
    tag: {
        padding: '5px 10px',
        borderRadius: '20px',
        color: '#fff',
        display: 'inline-block',
        marginTop: '10px',
        marginBottom: '10px',
    },
    tagColors: {
        foodservices: '#FF6347', // Tomato red
        artsandculture: '#8A2BE2', // Blue violet
        retail: '#32CD32', // Lime green
        grocery: '#FFD700', // Gold
        nature: '#228B22', // Forest green
        tourism: '#1E90FF', // Dodger blue
        recreation: '#FF8C00', // Dark orange
    },
    searchContainer: {
        marginBottom: '20px',
    },
    searchInput: {
        padding: '10px',
        fontSize: '1.2em',
        width: '100%',
        maxWidth: '400px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    filterContainer: {
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
    },
    filterLabel: {
        fontSize: '1.2em',
        marginRight: '10px',
    },
    filterSelect: {
        padding: '10px',
        fontSize: '1.2em',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-start', // Align buttons to the left (or 'center' or 'space-between' if you need different alignment)
        gap: '10px', // Space between buttons
        flexWrap: 'wrap', // Allows buttons to wrap to the next line if necessary
    },
    starRating: {
        fontSize: '1.5em',
        color: '#FFD700', // Gold color for filled stars
    },
    filledStar: {
        color: '#FFD700', // Gold for filled stars
    },
    emptyStar: {
        color: '#e0e0e0', // Light gray for empty stars
    },
    error: {
        color: 'red',
        fontSize: '1.2em',
    },
    loading: {
        fontSize: '1.2em',
        fontStyle: 'italic',
    },
    addButton: {
        backgroundColor: '#007BFF',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    feedbackSection: {
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    feedbackTextarea: {
        width: '80%',
        height: '80px',
        padding: '10px',
        fontSize: '14px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        resize: 'none',
    },
    ratingSection: {
        marginBottom: '10px',
    },
    ratingInput: {
        width: '50px',
        padding: '5px',
    },
    feedbackButton: {
        backgroundColor: '#007BFF',
        padding: '10px 20px',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',

    },
    submitFeedbackButton: {
        backgroundColor: '#28a745',
        padding: '10px 20px',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    feedbackCard: {
        background: '#f9f9f9',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
    },
    starRating: {
        display: 'flex',
        fontSize: '20px',
        cursor: 'pointer',
    },
    
};

export default VenuePage;