const express = require('express');
const router = express.Router();
const labtechnicianController = require('../controllers/labtechnicianController');

// Lab Technician Management
router.post('/technicians', labtechnicianController.registerLabTechnician);
router.get('/technicians/:labTechnicianId', labtechnicianController.getLabTechnicianById);
router.get('/technicians', labtechnicianController.listAllLabTechnicians);

// Lab Test Results Management
router.post('/results', labtechnicianController.createLabTestResult);
router.patch('/results/:resultId/send', labtechnicianController.sendResultToDoctor);
router.get('/results/:resultId', labtechnicianController.getLabTestResultById);
router.get('/results/technician/:labTechnicianId', labtechnicianController.listLabTestResultsByTechnician);
router.get('/results/pending', labtechnicianController.listPendingLabTestResults);

// Health Check
router.get('/health', labtechnicianController.healthCheck);

module.exports = router;
