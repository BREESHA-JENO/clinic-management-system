// const express = require('express');
// const router = express.Router();
// const doctorController = require('../controllers/doctorController');

// // Routes
// router.post('/', doctorController.createDoctor);
// router.put('/:id', doctorController.updateDoctor);
// router.get('/:id', doctorController.getDoctorById);
// router.get('/', doctorController.listDoctors);
// router.patch('/:id/deactivate', doctorController.deactivateDoctor);

// module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctorController');
const validation = require('../validation/doctorValidation');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const { 
  generateRoleToken, 
  ROLES, 
  verifyToken, 
  authorizeDoctor 
} = require('../middleware/auth');

// Doctor Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username, role: 'doctor' });

    if (!user) {
      return res.status(404).json({ message: 'Doctor not found' });
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
    const token = generateRoleToken(user._id, ROLES.DOCTOR, {
      username: user.username,
      name: user.name || 'Doctor'
    });

    res.status(200).json({ 
      success: true,
      message: 'Doctor login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: ROLES.DOCTOR,
        name: user.name || 'Doctor'
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};

// Consultation (Protected Routes)
router.post('/consultations', verifyToken, authorizeDoctor, validation.validateConsultation, validate, controller.addConsultationNote);
router.put('/consultations/:id', verifyToken, authorizeDoctor, controller.updateConsultationNote);
router.get('/consultations/appointment/:appointmentId', verifyToken, authorizeDoctor, controller.getConsultationByAppointment);
router.get('/consultations/doctor/:doctorId', verifyToken, authorizeDoctor, controller.listConsultationsByDoctor);

// Medicine Prescription (Protected Routes)
router.post('/prescriptions/medicine', verifyToken, authorizeDoctor, validation.validateMedicinePrescription, validate, controller.createMedicinePrescription);
router.put('/prescriptions/medicine/:id', verifyToken, authorizeDoctor, controller.updateMedicinePrescription);
router.get('/prescriptions/medicine/appointment/:appointmentId', verifyToken, authorizeDoctor, controller.getMedicineByAppointment);
router.get('/prescriptions/medicine/patient/:patientId', verifyToken, authorizeDoctor, controller.listMedicineByPatient);
router.get('/prescriptions/medicine/:prescriptionId', verifyToken, authorizeDoctor, controller.getMedicinePrescriptionById);

// Lab Test Prescription (Protected Routes)
router.post('/prescriptions/labtest', verifyToken, authorizeDoctor, validation.validateLabTestPrescription, validate, controller.createLabTestPrescription);
router.put('/prescriptions/labtest/:id', verifyToken, authorizeDoctor, controller.updateLabTestPrescription);
router.get('/prescriptions/labtest/appointment/:appointmentId', verifyToken, authorizeDoctor, controller.getLabTestByAppointment);
router.get('/prescriptions/labtest/patient/:patientId', verifyToken, authorizeDoctor, controller.listLabTestsByPatient);
router.get('/prescriptions/labtest/:prescriptionId', verifyToken, authorizeDoctor, controller.getLabTestPrescriptionById);

// Consultation & Medicine History (Protected Routes)
router.get('/consultations/patient/:patientId', verifyToken, authorizeDoctor, controller.listConsultationHistoryByPatient);
router.get('/consultations/doctor/:doctorId', verifyToken, authorizeDoctor, controller.listConsultationHistoryByDoctor);
router.get('/consultations/history/appointment/:appointmentId', verifyToken, authorizeDoctor, controller.getConsultationHistoryByAppointment);

router.get('/prescriptions/medicine/history/patient/:patientId', verifyToken, authorizeDoctor, controller.listMedicineByPatient);
router.get('/prescriptions/medicine/history/doctor/:doctorId', verifyToken, authorizeDoctor, controller.listMedicineHistoryByDoctor);
router.get('/prescriptions/medicine/history/appointment/:appointmentId', verifyToken, authorizeDoctor, controller.getMedicineByAppointment);

module.exports = router;
