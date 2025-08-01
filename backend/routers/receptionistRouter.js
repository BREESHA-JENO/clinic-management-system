const express = require('express');
const router = express.Router();

// Simple health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Receptionist API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 