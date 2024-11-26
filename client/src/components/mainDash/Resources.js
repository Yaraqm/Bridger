import React, { useEffect, useState } from 'react';
import Navbar from './Navbar'; 

const Resources = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetch('/api/resources')
      .then((response) => response.json())
      .then((data) => setResources(data))
      .catch((error) => console.error('Error fetching resources:', error));
  }, []);

   // Define the styles as JavaScript objects
   const pageStyles = {
    fontFamily: 'Raleway, sans-serif',
    margin: '0px',
    padding: '0px',
    backgroundColor: '#f9f9f9',
  };

  const headingStyles = {
    textAlign: 'center',
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '30px',
  };

  const loadingTextStyles = {
    fontSize: '1rem',
    color: '#555',
  };

  const resourcesListStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  };

  const resourceItemStyles = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '300px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  const titleStyles = {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '10px',
  };

  const textStyles = {
    fontSize: '0.95rem',
    color: '#666',
    marginBottom: '10px',
  };

  const linkStyles = {
    color: '#1e90ff',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  };

  const linkHoverStyles = {
    color: '#0056b3',
  };

  return (
    <div style={pageStyles}>
      <Navbar /> 
      <h1 style={headingStyles}>Accessibility Resources</h1>
      {resources.length > 0 ? (
        <div style={resourcesListStyles}>
          {resources.map((resource) => (
            <div
              key={resource.resource_id}
              style={resourceItemStyles}
            >
              <h2 style={titleStyles}>{resource.resource_name}</h2>
              <p style={textStyles}><strong>Type:</strong> {resource.resource_type}</p>
              <p style={textStyles}><strong>Contact:</strong> {resource.contact_number}</p>
              <p style={textStyles}><strong>Email:</strong> {resource.email}</p>
              <p style={textStyles}>
                <strong>Website:</strong>{' '}
                <a
                  href={resource.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyles}
                  onMouseEnter={(e) => (e.currentTarget.style = linkHoverStyles)}
                  onMouseLeave={(e) => (e.currentTarget.style = linkStyles)}
                >
                  {resource.website_url}
                </a>
              </p>
              <p style={textStyles}><strong>Location:</strong> {resource.location}</p>
              <p style={textStyles}><strong>Description:</strong> {resource.description}</p>
              <p style={textStyles}><strong>Accessibility Features:</strong> {resource.accessibility_features}</p>
              <p style={textStyles}><strong>Language Support:</strong> {resource.language_support}</p>
              <p style={textStyles}><strong>Availability Hours:</strong> {resource.availability_hours}</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={loadingTextStyles}>Loading resources...</p>
      )}
    </div>
  );
};

export default Resources;
