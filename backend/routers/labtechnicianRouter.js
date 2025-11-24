const express = require('express');
const router = express.Router();
const labtechnicianController = require('../controllers/labtechnicianController');
const User = require('../models/user');
const { 
  generateRoleToken, 
  ROLES, 
  verifyToken, 
  authorizeLabTechnician 
} = require('../middleware/auth');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username, role: 'labtech' });

    if (!user) {
      return res.status(404).json({ message: 'Lab Technician not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated. Contact admin.' });
    }

    // Check if account is locked
    if (user.isLocked()) {
      const lockTime = Math.ceil((user.lockUntil - Date.now()) / 1000);
      return res.status(423).json({ 
        message: `Account is temporarily locked. Try again in ${lockTime} seconds.`,
        lockTime: lockTime
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incLoginAttempts();
      const remainingAttempts = 3 - user.loginAttempts;
      
      if (remainingAttempts <= 0) {
        return res.status(423).json({ 
          message: 'Account locked for 30 seconds due to multiple failed attempts.',
          lockTime: 30
        });
      }
      
      return res.status(401).json({ 
        message: `Invalid credentials. ${remainingAttempts} attempts remaining.`,
        remainingAttempts: remainingAttempts
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Generate role-specific token
    const token = generateRoleToken(user._id, ROLES.LAB_TECHNICIAN, {
      username: user.username,
      name: user.name || 'Lab Technician'
    });

    res.status(200).json({ 
      success: true,
      message: 'Lab Technician login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: ROLES.LAB_TECHNICIAN,
        name: user.name || 'Lab Technician'
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Lab Test Management (Protected Routes)
router.post('/labtests', verifyToken, authorizeLabTechnician, labtechnicianController.addLabTest);
router.put('/labtests/:labTestId', verifyToken, authorizeLabTechnician, labtechnicianController.updateLabTest);
router.get('/labtests/:labTestId', verifyToken, authorizeLabTechnician, labtechnicianController.getLabTestById);
router.get('/labtests', verifyToken, authorizeLabTechnician, labtechnicianController.listLabTests);
router.patch('/labtests/:labTestId/deactivate', verifyToken, authorizeLabTechnician, labtechnicianController.deactivateLabTest);

// Lab Test Prescription Management (Protected Routes)
router.put('/labtests/results/:labTestPrescriptionId', verifyToken, authorizeLabTechnician, labtechnicianController.recordLabTestResult);
router.get('/labtests/results/appointment/:appointmentId', verifyToken, authorizeLabTechnician, labtechnicianController.getLabTestResultByAppointmentId);
router.get('/labtests/appointment/:appointmentId', verifyToken, authorizeLabTechnician, labtechnicianController.getLabTestPrescriptionByAppointmentId);
router.get('/labtests/results', verifyToken, authorizeLabTechnician, labtechnicianController.listLabTestResultsByDateRange);
router.patch('/labtests/:labTestPrescriptionId/deactivate', verifyToken, authorizeLabTechnician, labtechnicianController.deactivateLabTestPrescription);

// Integration routes for Doctor module (Protected Routes)
router.get('/labtests/test/:testId', verifyToken, authorizeLabTechnician, labtechnicianController.getLabTestByTestId);
router.get('/labtests/category/:category', verifyToken, authorizeLabTechnician, labtechnicianController.getLabTestsByCategory);
router.post('/process-test-prescription', verifyToken, authorizeLabTechnician, labtechnicianController.processDoctorLabTestPrescription);

// Lab Test Results Management (Protected Routes)
router.post('/results', verifyToken, authorizeLabTechnician, labtechnicianController.createLabTestResult);
router.patch('/results/:resultId/send', verifyToken, authorizeLabTechnician, labtechnicianController.sendResultToDoctor);
router.get('/results/pending', verifyToken, authorizeLabTechnician, labtechnicianController.listPendingLabTestResults);
router.get('/results/patient/:patientId', verifyToken, authorizeLabTechnician, labtechnicianController.getLabTestResultsByPatient);
router.get('/results/technician/:labTechnicianId', verifyToken, authorizeLabTechnician, labtechnicianController.listLabTestResultsByTechnician);
router.get('/results/:resultId', verifyToken, authorizeLabTechnician, labtechnicianController.getLabTestResultById);

// Health Check (Public Route)
router.get('/health', labtechnicianController.healthCheck);

// Cross-module integration routes (Protected Routes)
router.get('/doctor-lab-prescriptions', verifyToken, authorizeLabTechnician, labtechnicianController.getDoctorLabTestPrescriptions);
router.get('/lab-results-for-doctor', verifyToken, authorizeLabTechnician, labtechnicianController.getLabTestResultsForDoctor);

module.exports = router;
