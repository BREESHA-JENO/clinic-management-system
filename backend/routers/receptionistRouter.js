const express = require('express');
const router = express.Router();

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
