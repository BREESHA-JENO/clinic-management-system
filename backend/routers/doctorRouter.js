const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Doctor API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
