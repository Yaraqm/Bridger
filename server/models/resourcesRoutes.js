const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resourcesController');

// Define the route for getting all resources
router.get('/resources', resourcesController.getAllResources);

module.exports = router;


// // server/routes/resourcesRoutes.js
// const express = require('express');
// const router = express.Router();
// const resourcesController = require('../controllers/resourcesController'); // Import the controller

// // Route to fetch all resources
// router.get('/resources', resourcesController.getAllResources);

// module.exports = router;
