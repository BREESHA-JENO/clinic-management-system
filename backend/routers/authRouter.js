const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Role-specific login endpoints
router.post('/admin/login', authController.adminLogin);
router.post('/receptionist/login', authController.receptionistLogin);
router.post('/doctor/login', authController.doctorLogin);
router.post('/labtech/login', authController.labtechLogin);
router.post('/labtechnician/login', authController.labtechLogin); // Alias for labtech
router.post('/pharmacist/login', authController.pharmacistLogin);

// Generic login endpoint (requires role in body)
router.post('/login', authController.login);

// Protected routes (require authentication)
router.use(verifyToken);

// Get current user info
router.get('/me', authController.getCurrentUser);

// Logout
router.post('/logout', authController.logout);

module.exports = router; 