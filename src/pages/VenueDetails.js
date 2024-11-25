import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VenueDetails = ({ match }) => {
    const [venue, setVenue] = useState({});

    useEffect(() => {
        const fetchVenue = async () => {
            const response = await axios.get(`http://localhost:5000/api/venues/${match.params.id}`);
            setVenue(response.data);
        };

        fetchVenue();
    }, [match.params.id]);

    return (
        <div>
            <h2>{venue.name}</h2>
            <p>{venue.description}</p>
            <p>Accessibility Score: {venue.accessibility_score}</p>
        </div>
    );
};

export default VenueDetails;
