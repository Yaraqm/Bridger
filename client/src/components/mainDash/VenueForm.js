import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

// VenueForm Component
const VenueForm = () => {
    const navigate = useNavigate();

    // Navigation and session storage
    const goBack = () => {
        navigate(-1) || navigate(sessionStorage.getItem('previousPage') || '/dashboard');
    };

    useEffect(() => {
        sessionStorage.setItem('previousPage', window.location.pathname);
    }, []);

    // Initial form state
    const [formData, setFormData] = useState({
        location_name: '',
        location_address: '',
        location_description: '',
        location_type: '',  // Dropdown value
        accessibility_score: '',
    });

    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFocus = (e) => {
        const { name } = e.target;
        setErrors({ ...errors, [name]: false });
    };

    // Form validation
    const validateForm = () => {
        const accessibilityScore = Number(formData.accessibility_score); // Ensure it's a number
        const newErrors = {
            location_name: !formData.location_name,
            location_address: !formData.location_address,
            location_description: !formData.location_description,
            location_type: !formData.location_type,
            accessibility_score: !formData.accessibility_score || isNaN(accessibilityScore) || accessibilityScore < 1 || accessibilityScore > 10,
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((fieldError) => !fieldError);
    };
    

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const formDataToSend = {
                ...formData,
                accessibility_score: Number(formData.accessibility_score), // Ensure it's a number
            };
    
            try {
                const response = await fetch('http://localhost:5000/api/locationSubmission', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formDataToSend),
                });
    
                const result = await response.json();
                if (response.ok) {
                    setShowModal(true);
                    setFormData({
                        location_name: '',
                        location_address: '',
                        location_description: '',
                        location_type: '',
                        accessibility_score: '',
                    });
                } else {
                    console.error('Submission failed:', result);
                    alert(`Error: ${result.message || 'An error occurred'}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert(`Network Error: ${error.message}`);
            }
        } else {
            console.log('Please fill all required fields.');
        }
    };
    

    return (
        <div style={styles.pageContainer}>
            {/* Header Styled Like Admin Dashboard */}
            <Navbar />
            {/* Form Container */}
            <div style={styles.formContainer}>
                <h2 style={styles.heading}>Venue Submission Form</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Form Fields */}
                    {[ 
                        { label: 'Location Name (required):', id: 'location_name', type: 'text', error: errors.location_name },
                        { label: 'Address (required):', id: 'location_address', type: 'text', error: errors.location_address },
                        { label: 'Description (required):', id: 'location_description', type: 'text', error: errors.location_description },
                        { 
                            label: 'Type (required):', 
                            id: 'location_type', 
                            type: 'select',  // Changing input type to 'select'
                            error: errors.location_type,
                            options: ['foodservices', 'artsandculture', 'retail', 'grocery', 'nature', 'tourism', 'recreation']  // List of available enum options
                        },
                        { label: 'Accessibility Score (1-10) (required):', id: 'accessibility_score', type: 'number', error: errors.accessibility_score },
                    ].map((field, index) => (
                        <div style={styles.formGroup} key={index}>
                            <label htmlFor={field.id} style={styles.label}>{field.label}</label>
                            {/* Conditionally render a select dropdown or input */}
                            {field.type === 'select' ? (
                                <select
                                    id={field.id}
                                    name={field.id}
                                    value={formData[field.id]}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    style={{ ...styles.input, ...(field.error ? styles.errorInput : {}) }}
                                >
                                    <option value="">Select a type</option>
                                    {field.options.map((option, idx) => (
                                        <option key={idx} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    id={field.id}
                                    name={field.id}
                                    value={formData[field.id]}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    style={{ ...styles.input, ...(field.error ? styles.errorInput : {}) }}
                                />
                            )}
                            {field.error && <span style={styles.errorMessage}>This field is required</span>}
                            {field.id === 'accessibility_score' && formData.accessibility_score && (formData.accessibility_score < 1 || formData.accessibility_score > 10) && (
                                <span style={styles.errorMessage}>Please enter a number between 1 and 10.</span>
                            )}
                        </div>
                    ))}

                    {/* Submit Button */}
                    <button type="submit" style={styles.submitBtn}>
                        Submit Venue
                    </button>
                </form>

                {/* Success Modal */}
                {showModal && (
                    <div style={styles.modal}>
                        <div style={styles.modalContent}>
                            <h3 style={styles.modalTitle}>Success!</h3>
                            <p>Your venue has been submitted successfully!</p>
                            <button onClick={() => setShowModal(false)} style={styles.closeModalBtn}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Inline styles object
const styles = {
    pageContainer: {
        minHeight: '100vh',
        background: 'linear-gradient(to right, #D8BEF3, #CDD5E8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        backgroundColor: '#00004A',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: '0',
    },
    headerButton: {
        padding: '10px 20px',
        backgroundColor: '#00004A',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        marginLeft: 'auto',
    },
    formContainer: {
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '800px',
        padding: '40px',
        margin: '20px auto',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    label: {
        fontWeight: 'bold',
    },
    input: {
        padding: '10px',
        fontSize: '1rem',
        width: '100%',
        borderRadius: '6px',
        border: '1px solid #ddd',
    },
    errorInput: {
        border: '1px solid red',
    },
    errorMessage: {
        color: 'red',
        fontSize: '0.9rem',
    },
    submitBtn: {
        backgroundColor: '#00004A',
        color: '#fff',
        padding: '12px 20px',
        fontSize: '1rem',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '6px',
        textAlign: 'center',
    },
    modalTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    closeModalBtn: {
        marginTop: '10px',
        padding: '10px 20px',
        backgroundColor: '#00004A',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
};

export default VenueForm;


