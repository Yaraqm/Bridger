
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div style={styles.modalBackdrop}>
            <div style={styles.modalContainer}>
                <p style={styles.modalMessage}>{message}</p>
                <button onClick={onClose} style={styles.modalButton}>Close</button>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [filteredVolunteers, setFilteredVolunteers] = useState([]);
    const [venues, setVenues] = useState([]);
    const [filteredVenues, setFilteredVenues] = useState([]);
    const [volunteerFilter, setVolunteerFilter] = useState('');
    const [venueFilter, setVenueFilter] = useState('');
    const [volunteerSearchQuery, setVolunteerSearchQuery] = useState('');
    const [venueSearchQuery, setVenueSearchQuery] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const volunteerRes = await fetch('/api/volunteer');
                if (!volunteerRes.ok) throw new Error(`Volunteer fetch error: ${volunteerRes.status}`);
                const volunteersData = await volunteerRes.json();
                setVolunteers(volunteersData);
                setFilteredVolunteers(volunteersData);

                const venueRes = await fetch('/api/locationSubmission');
                if (!venueRes.ok) throw new Error(`Venue fetch error: ${venueRes.status}`);
                const venuesData = await venueRes.json();
                console.log(venuesData);  // Log venue data here
                setVenues(venuesData);
                setFilteredVenues(venuesData);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchData();
    }, []);

    const handleVolunteerFilterChange = (e) => {
        const value = e.target.value;
        setVolunteerFilter(value);
        let sortedData = [...volunteers];
        if (value === 'name') {
            sortedData.sort((a, b) => (a.volunteerName || '').localeCompare(b.volunteerName || ''));
        } else if (value === 'date') {
            sortedData.sort((a, b) => new Date(a.application_date || 0) - new Date(b.application_date || 0));
        }
        setFilteredVolunteers(sortedData);
    };

    const handleVenueFilterChange = (e) => {
        const value = e.target.value;
        setVenueFilter(value);
        let sortedData = [...venues];
        if (value === 'name') {
            sortedData.sort((a, b) => (a.location_name || '').localeCompare(b.location_name || ''));
        } else if (value === 'location') {
            sortedData.sort((a, b) => (a.location_address || '').localeCompare(b.location_address || ''));
        } else if (value === 'accessibility') {
            sortedData.sort((a, b) => a.accessibility_score - b.accessibility_score);
        }
        setFilteredVenues(sortedData);
    };

    const handleVolunteerSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setVolunteerSearchQuery(query);
        const filteredData = volunteers.filter((volunteer) =>
            ['volunteerName', 'skills', 'certifications'].some((field) =>
                (volunteer[field] || '').toLowerCase().includes(query)
            )
        );
        setFilteredVolunteers(filteredData);
    };

    const handleVenueSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setVenueSearchQuery(query);
        const filteredData = venues.filter((venue) =>
            ['location_name', 'location_address', 'location_description', 'location_type'].some((field) =>
                (venue[field] || '').toLowerCase().includes(query)
            )
        );
        setFilteredVenues(filteredData);
    };

    const handleDelete = async (location_submission_id) => {
        try {
            const response = await fetch(`/api/locationSubmission/${location_submission_id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`Delete error: ${response.status}`);
            setVenues((prev) => prev.filter((v) => v.location_submission_id !== location_submission_id));
            setFilteredVenues((prev) => prev.filter((v) => v.location_submission_id !== location_submission_id));
            setSuccessMessage("Successfully deleted venue"); // Show success message
        } catch (error) {
            console.error('Error deleting venue:', error.message);
        }
    };

    const handleAccept = async (location_submission_id) => {
        try {
            const response = await fetch(`/api/locationSubmission/accept/${location_submission_id}`, { method: 'POST' });
            if (!response.ok) throw new Error(`Accept error: ${response.status}`);
            setVenues((prev) => prev.filter((v) => v.location_submission_id !== location_submission_id));
            setFilteredVenues((prev) => prev.filter((v) => v.location_submission_id !== location_submission_id));
            setSuccessMessage("Successfully added venue"); // Show success message
        } catch (error) {
            console.error('Error accepting venue:', error.message);
        }
    };

    const handleCloseModal = () => setSuccessMessage(''); // Close the modal

    const handleBackClick = () => navigate(-1);

    return (
        <div>
            <header style={styles.header}>
                <button onClick={handleBackClick} style={styles.backButton}>
                    Back
                </button>
            </header>
            <div style={styles.pageContainer}>
                <h1 style={styles.heading}>Admin Dashboard</h1>

                {/* Volunteer Section */}
                <div style={styles.formContainer}>
                    <h2 style={styles.volunteerHeading}>Submitted Volunteer Forms</h2>
                    <div style={styles.filterContainer}>
                        <label htmlFor="volunteer-filter">Filter by: </label>
                        <select id="volunteer-filter" value={volunteerFilter} onChange={handleVolunteerFilterChange} style={styles.select}>
                            <option value="">Select</option>
                            <option value="name">Name</option>
                            <option value="date">Application Date</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search volunteers..."
                            value={volunteerSearchQuery}
                            onChange={handleVolunteerSearchChange}
                            style={styles.searchBar}
                        />
                    </div>
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.tableHeader}>Name</th>
                                    <th style={styles.tableHeader}>Availability</th>
                                    <th style={styles.tableHeader}>Skills</th>
                                    <th style={styles.tableHeader}>Certifications</th>
                                    <th style={styles.tableHeader}>Contact Number</th>
                                    <th style={styles.tableHeader}>Email</th>
                                    <th style={styles.tableHeader}>Areas of Interest</th>
                                    <th style={styles.tableHeader}>Application Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVolunteers.length > 0 ? (
                                    filteredVolunteers.map((volunteer) => (
                                        <tr key={volunteer.id}>
                                            <td style={styles.tableCell}>{volunteer.volunteerName}</td>
                                            <td style={styles.tableCell}>{volunteer.availability}</td>
                                            <td style={styles.tableCell}>{volunteer.skills}</td>
                                            <td style={styles.tableCell}>{volunteer.certifications}</td>
                                            <td style={styles.tableCell}>{volunteer.contact_number}</td>
                                            <td style={styles.tableCell}>{volunteer.email}</td>
                                            <td style={styles.tableCell}>{volunteer.areas_of_interest}</td>
                                            <td style={styles.tableCell}>{new Date(volunteer.application_date || '').toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" style={styles.tableCell}>No volunteers found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Venue Section */}
                <div style={styles.formContainer}>
                    <h2 style={styles.venueHeading}>Submitted Venue Forms</h2>
                    <div style={styles.filterContainer}>
                        <label htmlFor="venue-filter">Filter by: </label>
                        <select id="venue-filter" value={venueFilter} onChange={handleVenueFilterChange} style={styles.select}>
                            <option value="">Select</option>
                            <option value="name">Venue Name</option>
                            <option value="location">Location</option>
                            <option value="accessibility">Accessibility Score</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search venues..."
                            value={venueSearchQuery}
                            onChange={handleVenueSearchChange}
                            style={styles.searchBar}
                        />
                    </div>
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.tableHeader}>Location Name</th>
                                    <th style={styles.tableHeader}>Location Address</th>
                                    <th style={styles.tableHeader}>Description</th>
                                    <th style={styles.tableHeader}>Type</th>
                                    <th style={styles.tableHeader}>Accessibility Score</th>
                                    <th style={styles.tableHeader}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVenues.length > 0 ? (
                                    filteredVenues.map((venue) => (
                                        <tr key={venue.location_submission_id}>
                                            <td style={styles.tableCell}>{venue.location_name}</td>
                                            <td style={styles.tableCell}>{venue.location_address}</td>
                                            <td style={styles.tableCell}>{venue.location_description}</td>
                                            <td style={styles.tableCell}>{venue.location_type}</td>
                                            <td style={styles.tableCell}>{venue.accessibility_score}</td>
                                            <td style={styles.tableCell}>
                                                <button onClick={() => handleAccept(venue.location_submission_id)} style={styles.acceptButton}>Accept</button>
                                                <button onClick={() => handleDelete(venue.location_submission_id)} style={styles.deleteButton}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={styles.tableCell}>No venues found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Success Modal */}
                <SuccessModal message={successMessage} onClose={handleCloseModal} />
            </div>
        </div>
    );
};

const styles = {
    header: {
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#00004A',
        color: '#FFF',
        padding: '20px 10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        padding: '10px 20px',
        backgroundColor: '#00004A', // Same color as the header
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        marginLeft: 'auto', // Aligns the button to the right
        marginRight: '30px', // Aligns the button to the right
    },
    pageContainer: {
        padding: '20px',
        paddingTop: '70px', // Space for the fixed header
        background: 'linear-gradient(45deg, #cdd5e8, #ddbdf2, white)',
        minHeight: '100vh',
        animation: 'gradientAnimation 3s infinite',
    },
    heading: {
        fontSize: '2rem',
        marginBottom: '30px',
        textAlign: 'center', 
    },
    formContainer: {
        marginBottom: '30px',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#ffff',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        marginRight: '20px',
        marginLeft: '20px',
    },
    volunteerHeading: {
        fontSize: '1.5rem',
        marginBottom: '15px',
        textAlign: 'left', // Align volunteer section title to the left
    },
    venueHeading: {
        fontSize: '1.5rem',
        marginBottom: '15px',
        textAlign: 'left', // Align venue section title to the left
    },
    filterContainer: {
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'flex-end', // Align filter and search boxes to the right
        alignItems: 'center',
    },
    searchBar: {
        padding: '10px',
        fontSize: '1rem',
        width: '100%',
        maxWidth: '300px',
        marginLeft: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    select: {
        padding: '10px',
        fontSize: '1rem',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    tableContainer: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableCell: {
        padding: '12px',
        textAlign: 'left',
        border: '1px solid #ddd',
    },
    tableHeader: {
        padding: '12px',
        textAlign: 'left',
        border: '1px solid #ddd',
        fontWeight: 'bold',
        backgroundColor: 'transparent', // Adding background color to headers for distinction
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
        color: '#FFF',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginRight: '6px',
        marginLeft: '20px',
    },
    deleteButton: {
        backgroundColor: '#F44336',
        color: '#FFF',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        //marginRight: '-0px',
    },
    modalBackdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      },
      modalContainer: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      },
      modalMessage: {
        fontSize: '18px',
        marginBottom: '20px',
      },
      modalButton: {
        backgroundColor: '#F5906E',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      },
};

export default AdminDashboard;



