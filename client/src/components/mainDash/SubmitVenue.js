import React, { useState } from 'react';
import axios from 'axios';


const SubmitVenue = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        type: '',
        accessibility_score: 0,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/venues', formData);
            alert('Venue submitted for review!');
        } catch (err) {
            alert('Error: ' + err.response.data.error);
        }
    };

    return (
        
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Venue Name" onChange={handleChange} />
            <input type="text" name="address" placeholder="Address" onChange={handleChange} />
            <textarea name="description" placeholder="Description" onChange={handleChange} />
            <input type="text" name="type" placeholder="Type (e.g., Food)" onChange={handleChange} />
            <input
                type="number"
                name="accessibility_score"
                placeholder="Accessibility Score (1-5)"
                onChange={handleChange}
            />
            <button type="submit">Submit Venue</button>
        </form>
    );
};

export default SubmitVenue;
