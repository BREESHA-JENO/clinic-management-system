const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.send('Pharmacist route working!');
});

module.exports = router;
