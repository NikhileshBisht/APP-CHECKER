// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Register data
router.post('/register', dataController.registerData);

// Update data
router.put('/update', dataController.updateData);

// Get all data
router.get('/data', dataController.getData);

// update-status
router.put('/update-status',dataController.updateToggleStatus);
module.exports = router;
