const axios = require('axios');
const sequelize = require('./config/database');  // Sequelize instance
const Venue = require('./models/venue');         // Venue model

const apiKey = 'AIzaSyDTqDNf0vURy8uZLTZo7mtp9QmbuCxkSlQ'; // Replace with your actual API key

// Function to clean and standardize addresses
function cleanAddress(address) {
  return address
    .replace(/\./g, '') // Remove periods
    .replace(/E\b/g, 'East') // Replace abbreviations
    .replace(/Rd\b/g, 'Road') // Expand common abbreviations
    .replace(/St\b/g, 'Street');
}

async function processVenues() {
  try {
    // Authenticate with the database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Fetch venues with missing latitude or longitude
    const venues = await Venue.findAll({
      where: {
        latitude: null,
        longitude: null,
      },
    });

    console.log(`Found ${venues.length} venues to process.`);

    for (const venue of venues) {
      // Clean and format the address
      const cleanedAddress = cleanAddress(venue.address);

      // Call Google Geocoding API
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: cleanedAddress,
            key: apiKey,
          },
        }
      );

      if (response.data.results.length === 0) {
        console.log(`No results found for address: ${venue.address}`);
        continue;
      }

      const { lat, lng } = response.data.results[0].geometry.location;

      // Update venue with geocoded coordinates
      venue.latitude = lat;
      venue.longitude = lng;
      await venue.save();

      console.log(`Updated venue: ${venue.name} with lat: ${lat}, lng: ${lng}`);
    }

    console.log('Geocoding process completed.');
  } catch (error) {
    console.error('Error processing venues:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

processVenues();
