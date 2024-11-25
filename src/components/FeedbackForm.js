import React, { useState } from 'react';

const FeedbackForm = ({ venueId, userId, onFeedbackSubmit }) => {
    const [feedbackData, setFeedbackData] = useState({
        user_id: userId || '',
        venue_id: venueId || '',
        content: '',
        accessibility_score: '',
   
    });

    const [errors, setErrors] = useState({
        content: false,
        accessibility_score: false,
    });

    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFeedbackData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {
            content: !feedbackData.content,
            accessibility_score: !feedbackData.accessibility_score,
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((fieldError) => !fieldError);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch('/api/feedback/feedback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(feedbackData),
                });

                const responseText = await response.text(); // Get the raw response text
                console.log('Response Text:', responseText);

                // If the response is JSON, parse it
                let result = {};
                try {
                    result = JSON.parse(responseText);
                } catch (err) {
                    console.error('Error parsing JSON:', err);
                }

                if (response.ok) {
                    console.log('Feedback submitted successfully:', result);
                    setSubmissionSuccess(true);
                    setFeedbackData({
                        user_id: userId || '',
                        venue_id: venueId || '',
                        content: '',
                        accessibility_score: '',
                    });

                    // Notify parent about successful feedback submission
                    onFeedbackSubmit();
                } else {
                    console.error('Failed to submit feedback:', result);
                }
            } catch (error) {
                console.error('Error submitting feedback:', error);
            }
        } else {
            console.log('Please fill in all required fields');
        }
    };

    const formStyle = {
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        maxWidth: '400px',
        margin: '20px auto',
        fontFamily: 'Arial, sans-serif',
    };

    const inputStyle = (isError) => ({
        width: '100%',
        padding: '8px',
        margin: '10px 0',
        border: isError ? '1px solid red' : '1px solid #ddd',
        borderRadius: '4px',
    });

    const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '100%',
    };

    const successMessageStyle = {
        color: 'green',
        marginTop: '10px',
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <div>
                <label htmlFor="content">Feedback Text:</label>
                <textarea
                    id="content"
                    name="content"
                    value={feedbackData.content}
                    onChange={handleChange}
                    style={inputStyle(errors.content)}
                />
                {errors.content && <span style={{ color: 'red' }}>Text is required.</span>}
            </div>
            <div>
                <label htmlFor="accessibility_score">Rating (1-5):</label>
                <input
                    type="number"
                    id="accessibility_score"
                    name="accessibility_score"
                    value={feedbackData.accessibility_score}
                    onChange={handleChange}
                    min="1"
                    max="5"
                    style={inputStyle(errors.accessibility_score)}
                />
                {errors.accessibility_score && <span style={{ color: 'red' }}>Rating is required.</span>}
            </div>
            <button type="submit" style={buttonStyle}>Submit Feedback</button>
            {submissionSuccess && <p style={successMessageStyle}>Feedback submitted successfully!</p>}
        </form>
    );
};

export default FeedbackForm;
