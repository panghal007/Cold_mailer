const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// Define routes
router.post('/schedule', emailController.scheduleEmail);

module.exports = router;
