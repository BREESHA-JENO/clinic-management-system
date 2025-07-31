const express = require('express');
const router = express.Router();
const labtechnicianController = require('../controllers/labtechnicianController');

router.post('/', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  // Logic to create or validate doctor user
  res.status(201).json({ message: 'Lab Technician login or creation successful' });
});

// Lab Test Management
router.post('/labtests', labtechnicianController.addLabTest);
router.put('/labtests/:labTestId', labtechnicianController.updateLabTest);
router.get('/labtests/:labTestId', labtechnicianController.getLabTestById);
router.get('/labtests', labtechnicianController.listLabTests);
router.patch('/labtests/:labTestId/deactivate', labtechnicianController.deactivateLabTest);

// Lab Test Prescription Management
router.put('/labtests/results/:labTestPrescriptionId', labtechnicianController.recordLabTestResult);
router.get('/labtests/results/appointment/:appointmentId', labtechnicianController.getLabTestResultByAppointmentId);
router.get('/labtests/results/:resultId', labtechnicianController.getLabTestResultById);
router.get('/labtests/results', labtechnicianController.listLabTestResultsByDateRange);
router.patch('/labtests/:labTestPrescriptionId/deactivate', labtechnicianController.deactivateLabTestPrescription);

// Integration routes for Doctor module
router.get('/labtests/:testId', labtechnicianController.getLabTestById);
router.get('/labtests/category/:category', labtechnicianController.getLabTestsByCategory);
router.post('/process-test-prescription', labtechnicianController.processDoctorLabTestPrescription);
router.get('/labtests/results/patient/:patientId', labtechnicianController.getLabTestResultsByPatient);

module.exports = router;
