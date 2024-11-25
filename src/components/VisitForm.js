import React, { useState } from 'react';
import axios from 'axios';

const VisitForm = ({ venueId, userId, onVisitSubmit }) => {
    const [visitDate, setVisitDate] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Handle the date change
    const handleDateChange = (e) => {
        setVisitDate(e.target.value);
    };

    // Handle the notes change
    const handleNotesChange = (e) => {
        setNotes(e.target.value);
    };

    // Submit the visit form
    const handleVisitSubmit = async () => {
        if (!visitDate) {
            setError('Visit date is required');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.post(
                'http://localhost:5000/api/user-visit',
                {
                    user_id: userId,
                    venue_id: venueId,
                    visit_date: visitDate,
                    notes: notes,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setSuccess('Visit successfully recorded!');
                onVisitSubmit(); // Notify the parent component
            } else {
                setError('Failed to record visit.');
            }
        } catch (error) {
            console.error('Error submitting visit:', error);
            setError('There was an error submitting your visit.');
        }
    };

    return (
        <div>
            {/* Button to toggle form visibility */}
            <button 
                onClick={() => setShowForm(!showForm)} 
                style={buttonStyle}
            >
                Record Your Visit
            </button>

            {/* Conditionally show the form if 'showForm' is true */}
            {showForm && (
                <div style={formContainerStyle}>
                    <h3 style={headerStyle}>Record Your Visit</h3>
                    <form>
                        <div style={inputGroupStyle}>
                            <label htmlFor="visitDate" style={labelStyle}>Visit Date:</label>
                            <input
                                type="date"
                                id="visitDate"
                                value={visitDate}
                                onChange={handleDateChange}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div style={inputGroupStyle}>
                            <label htmlFor="notes" style={labelStyle}>Notes:</label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={handleNotesChange}
                                placeholder="Add any notes about your visit"
                                style={textareaStyle}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleVisitSubmit}
                            style={submitButtonStyle}
                        >
                            Submit Visit
                        </button>
                    </form>

                    {/* Error and success messages */}
                    {error && <p style={errorStyle}>{error}</p>}
                    {success && <p style={successStyle}>{success}</p>}
                </div>
            )}
        </div>
    );
};

// Styles
const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'center',
};

const formContainerStyle = {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    width: '300px',
    margin: '0 auto',
};

const headerStyle = {
    textAlign: 'center',
    marginBottom: '15px',
    fontSize: '18px',
};

const inputGroupStyle = {
    marginBottom: '15px',
};

const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: '600',
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    boxSizing: 'border-box',
};

const textareaStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    boxSizing: 'border-box',
    minHeight: '80px',
};

const submitButtonStyle = {
    padding: '12px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
    marginTop: '10px',
};

const errorStyle = {
    color: 'red',
    marginTop: '10px',
    textAlign: 'center',
};

const successStyle = {
    color: 'green',
    marginTop: '10px',
    textAlign: 'center',
};

export default VisitForm;