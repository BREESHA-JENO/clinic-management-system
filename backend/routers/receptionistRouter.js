const express = require('express');
const router = express.Router();
const receptionistController = require('../controllers/receptionistController');
const User = require('../models/user');
const { 
  generateRoleToken, 
  ROLES, 
  verifyToken, 
  authorizeReceptionist 
} = require('../middleware/auth');


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username, role: 'receptionist' });

    if (!user) {
      return res.status(404).json({ message: 'Receptionist not found' });
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
    const token = generateRoleToken(user._id, ROLES.RECEPTIONIST, {
      username: user.username,
      name: user.name || 'Receptionist'
    });

    res.status(200).json({ 
      success: true,
      message: 'Receptionist login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: ROLES.RECEPTIONIST,
        name: user.name || 'Receptionist'
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// router.get('/test', (req, res) => {
//   res.send('Receptionist route working!');
// });
// router.post('/', (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) {
//     return res.status(400).json({ error: 'Username and password are required' });
//   }
//   // Logic to create or validate doctor user
//   res.status(201).json({ message: 'receptionist login or creation successful' });
// });


// Health check (Public Route)
router.get('/health', receptionistController.healthCheck);

// ====== PATIENTS (Protected Routes) ======
router.post('/patients', verifyToken, authorizeReceptionist, receptionistController.registerPatient);
router.put('/patients/:patientId', verifyToken, authorizeReceptionist, receptionistController.updatePatient);
router.get('/patients/:patientId', verifyToken, authorizeReceptionist, receptionistController.getPatientById);
router.get('/patients', verifyToken, authorizeReceptionist, receptionistController.listAllPatients);
router.patch('/patients/:patientId/deactivate', verifyToken, authorizeReceptionist, receptionistController.deactivatePatient);
router.get('/patients/:patientId/history', verifyToken, authorizeReceptionist, receptionistController.getPatientHistory);

// ====== DOCTORS (Protected Routes) ======
router.post('/doctors', verifyToken, authorizeReceptionist, receptionistController.registerDoctor);
router.put('/doctors/:doctorId', verifyToken, authorizeReceptionist, receptionistController.updateDoctor);
router.get('/doctors/:doctorId', verifyToken, authorizeReceptionist, receptionistController.getDoctorById);
router.get('/doctors', verifyToken, authorizeReceptionist, receptionistController.listAllDoctors);

// ====== APPOINTMENTS (Protected Routes) ======
router.post('/appointments', verifyToken, authorizeReceptionist, receptionistController.scheduleAppointment);
router.put('/appointments/:appointmentId', verifyToken, authorizeReceptionist, receptionistController.updateAppointment);
router.get('/appointments/:appointmentId', verifyToken, authorizeReceptionist, receptionistController.getAppointmentById);
router.get('/appointments', verifyToken, authorizeReceptionist, receptionistController.listAppointmentsByDate);
router.patch('/appointments/:appointmentId/cancel', verifyToken, authorizeReceptionist, receptionistController.cancelAppointment);
router.get('/appointments/patient/:patientId', verifyToken, authorizeReceptionist, receptionistController.listAppointmentsByPatient);
router.get('/appointments/doctor/:doctorId', verifyToken, authorizeReceptionist, receptionistController.listAppointmentsByDoctor);

// ====== BILLING (Protected Routes) ======
router.post('/billing', verifyToken, authorizeReceptionist, receptionistController.generateAppointmentBill);
router.put('/billing/:appointmentId', verifyToken, authorizeReceptionist, receptionistController.updateAppointmentBill);
router.get('/billing/:appointmentId', verifyToken, authorizeReceptionist, receptionistController.getBillByAppointmentId);
router.get('/billing', verifyToken, authorizeReceptionist, receptionistController.listBillsByDateRange);
router.patch('/billing/:appointmentId/pay', verifyToken, authorizeReceptionist, receptionistController.recordPayment);
router.get('/billing/stats', verifyToken, authorizeReceptionist, receptionistController.getBillingStats);

// ====== DASHBOARD (Protected Routes) ======
router.get('/dashboard/stats', verifyToken, authorizeReceptionist, receptionistController.getDashboardStats);

// ====== INTEGRATIONS (Protected Routes) ======
router.get('/staff', verifyToken, authorizeReceptionist, receptionistController.listAllStaff);
router.get('/lab-tests', verifyToken, authorizeReceptionist, receptionistController.listAllLabTests);
router.get('/lab-results', verifyToken, authorizeReceptionist, receptionistController.listAllLabResults);
router.get('/medicines', verifyToken, authorizeReceptionist, receptionistController.listAllMedicines);
router.get('/prescriptions', verifyToken, authorizeReceptionist, receptionistController.listAllPrescriptions);

module.exports = router;
