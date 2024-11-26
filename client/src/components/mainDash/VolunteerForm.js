import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; 

// VolunteerForm Component
const VolunteerForm = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Save the current page in sessionStorage for navigation purposes
        sessionStorage.setItem('previousPage', window.location.pathname);
    }, []);


    // Initial state for form data
    const [formData, setFormData] = useState({
        volunteerName: '',
        availability: '',
        skills: '',
        certifications: '',
        contact_number: '',
        email: '',
        areas_of_interest: '',
    });

    // State to track form errors
    const [errors, setErrors] = useState({
        volunteerName: false,
        availability: false,
        contact_number: false,
        email: false,
    });

    // State for showing the success modal
    const [showModal, setShowModal] = useState(false);

    // Handle input changes and format phone numbers
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Format the contact number only when it's the 'contact_number' field
        if (name === 'contact_number') {
            const cleanedValue = value.replace(/\D/g, ''); // Remove non-digits
            let formattedValue = cleanedValue;

            // Add dashes after the third and sixth digits
            if (cleanedValue.length > 3 && cleanedValue.length <= 6) {
                formattedValue = `${cleanedValue.slice(0, 3)}-${cleanedValue.slice(3)}`;
            } else if (cleanedValue.length > 6) {
                formattedValue = `${cleanedValue.slice(0, 3)}-${cleanedValue.slice(3, 6)}-${cleanedValue.slice(6, 10)}`;
            }

            // Update the formData with the formatted phone number
            setFormData({ ...formData, [name]: formattedValue });
        } else {
            // For other fields, simply update the value
            setFormData({ ...formData, [name]: value });
        }
    };


    // Handle focus on inputs to clear errors
    const handleFocus = (e) => {
        const { name } = e.target;
        setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    };

    // Validate form inputs
    const validateForm = () => {
        const newErrors = {
            volunteerName: !formData.volunteerName,
            availability: !formData.availability,
            contact_number: !formData.contact_number || !/^\d{3}-\d{3}-\d{4}$/.test(formData.contact_number),
            email: !formData.email || !/\S+@\S+\.\S+/.test(formData.email),
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((fieldError) => !fieldError);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:5000/api/volunteer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();

                if (response.ok) {
                    console.log('Form submitted successfully:', result);
                    setShowModal(true);
                    // Reset form fields
                    setFormData({
                        volunteerName: '',
                        availability: '',
                        skills: '',
                        certifications: '',
                        contact_number: '',
                        email: '',
                        areas_of_interest: '',
                    });
                } else {
                    console.error('Failed to submit form:', result);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        } else {
            console.log('Please fill in all required fields');
        }
    };

    // Close the success modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div style={styles.pageContainer}>
            <Navbar />
            {/* Form Container */}
            <div style={styles.formContainer}>
                <h2 style={styles.heading}>Volunteer Application Form</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Form Fields */}
                    {[
                        { label: 'Name (required):', id: 'volunteerName', type: 'text', error: errors.volunteerName },
                        { label: 'Availability (required):', id: 'availability', type: 'text', error: errors.availability },
                        { label: 'Contact Number:', id: 'contact_number', type: 'text', error: errors.contact_number, placeholder: '123-456-7890' },
                        { label: 'Email (required):', id: 'email', type: 'email', error: errors.email },
                    ].map((field, index) => (
                        <div style={styles.formGroup} key={index}>
                            <label htmlFor={field.id} style={styles.label}>{field.label}</label>
                            <input
                                type={field.type}
                                id={field.id}
                                name={field.id}
                                value={formData[field.id]}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                style={{ ...styles.input, ...(field.error ? styles.errorInput : {}) }}
                                placeholder={field.placeholder || ''}
                            />
                            {field.error && <span style={styles.errorMessage}>This field is required</span>}
                        </div>
                    ))}

                    {/* Additional Fields */}
                    {['skills', 'certifications', 'areas_of_interest'].map((field, index) => (
                        <div style={styles.formGroup} key={index}>
                            <label htmlFor={field} style={styles.label}>{field.replace(/_/g, ' ')}:</label>
                            <textarea
                                id={field}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                style={styles.textarea}
                                placeholder={`Enter your ${field.replace(/_/g, ' ')}`}
                            />
                        </div>
                    ))}

                    {/* Submit Button */}
                    <button type="submit" style={styles.submitBtn}>
                        Submit Application
                    </button>
                </form>

                {/* Success Modal */}
                {showModal && (
                    <div style={styles.modal}>
                        <div style={styles.modalContent}>
                            <h3 style={styles.modalTitle}>Success!</h3>
                            <p>Your volunteer application has been submitted successfully!</p>
                            <button onClick={handleCloseModal} style={styles.closeModalBtn}>Close</button>
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
        margin: '0', // Ensure no gap above
    },
    headerButton: {
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
        marginRight: '20px', // Aligns the button to the right
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
    textarea: {
        padding: '10px',
        fontSize: '1rem',
        width: '100%',
        borderRadius: '6px',
        border: '1px solid #ddd',
        height: '100px',
    },
    errorInput: {
        border: '1px solid red',
    },
    errorMessage: {
        color: 'red',
        fontSize: '0.9rem',
    },
    submitBtn: {
        backgroundColor: 'green',
        color: '#fff',
        padding: '12px 20px',
        fontSize: '1rem',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
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
        backgroundColor: '#F5906E',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
};

export default VolunteerForm;
