<<<<<<< HEAD
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

=======
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


const User = require('../models/user'); // Assuming your user model is in models/user.js
const bcrypt = require('bcryptjs');

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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', doctorId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};

// Consultation
router.post('/consultations', validation.validateConsultation, validate, controller.addConsultationNote);
router.put('/consultations/:id', controller.updateConsultationNote);
router.get('/consultations/appointment/:appointmentId', controller.getConsultationByAppointment);
router.get('/consultations/doctor/:doctorId', controller.listConsultationsByDoctor);

// Medicine Prescription
router.post('/prescriptions/medicine', validation.validateMedicinePrescription, validate, controller.createMedicinePrescription);
router.put('/prescriptions/medicine/:id', controller.updateMedicinePrescription);
router.get('/prescriptions/medicine/appointment/:appointmentId', controller.getMedicineByAppointment);
router.get('/prescriptions/medicine/patient/:patientId', controller.listMedicineByPatient);

// Lab Test Prescription
router.post('/prescriptions/labtest', validation.validateLabTestPrescription, validate, controller.createLabTestPrescription);
router.put('/prescriptions/labtest/:id', controller.updateLabTestPrescription);
router.get('/prescriptions/labtest/appointment/:appointmentId', controller.getLabTestByAppointment);
router.get('/prescriptions/labtest/patient/:patientId', controller.listLabTestsByPatient);

// Consultation & Medicine History
router.get('/consultations/patient/:patientId', controller.listConsultationHistoryByPatient);
router.get('/consultations/doctor/:doctorId', controller.listConsultationHistoryByDoctor);
router.get('/consultations/history/appointment/:appointmentId', controller.getConsultationHistoryByAppointment);

router.get('/prescriptions/medicine/history/patient/:patientId', controller.listMedicineByPatient);
router.get('/prescriptions/medicine/history/doctor/:doctorId', controller.listMedicineHistoryByDoctor);
router.get('/prescriptions/medicine/history/appointment/:appointmentId', controller.getMedicineByAppointment);

>>>>>>> d890af73c091528a847f4dd611078c653778c3e1
module.exports = router;
