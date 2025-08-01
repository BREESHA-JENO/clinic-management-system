const express = require('express');
const router = express.Router();

<<<<<<< HEAD
// Simple health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Receptionist API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 
=======
router.get('/test', (req, res) => {
  res.send('Receptionist route working!');
});
router.post('/', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  // Logic to create or validate doctor user
  res.status(201).json({ message: 'receptionist login or creation successful' });
});

module.exports = router;
>>>>>>> d890af73c091528a847f4dd611078c653778c3e1
