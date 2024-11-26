// // server/controllers/resourcesController.js
// const Resource = require('../models/resources'); // Correct import to the model

// // Function to get all resources
// exports.getAllResources = async (req, res) => {
//   try {
//     const resources = await Resource.findAll();
//     // If you are using EJS to render the view
//     res.render('index', { resources }); // Render the resources on the index page
//     // Or if you're using an API:
//     // res.json(resources); // Send JSON response
//   } catch (error) {
//     console.error('Error fetching resources:', error);
//     res.status(500).send('Error fetching resources');
//   }
// };

// // Function to get a single resource by ID
// exports.getResourceById = async (req, res) => {
//   try {
//     const resource = await Resource.findByPk(req.params.id);
//     if (resource) {
//       res.json(resource); // Return the resource as JSON
//     } else {
//       res.status(404).send('Resource not found');
//     }
//   } catch (error) {
//     console.error('Error fetching resource:', error);
//     res.status(500).send('Error fetching resource');
//   }
// };


const Resource = require('../models/resources');

exports.getAllResources = (req, res) => {
  // Fetch resources from the database
  Resource.findAll()
    .then(resources => {
      // Send resources as a JSON response
      res.json(resources);
    })
    .catch(err => {
      // If there's an error, return a JSON error response
      console.error('Error fetching resources:', err);
      res.status(500).json({ message: 'Error fetching resources' });
    });
};
