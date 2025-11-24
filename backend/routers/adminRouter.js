const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');
const { 
  verifyToken, 
  authorizeAdmin
} = require('../middleware/auth');
const validate = require('../validation/adminValidation');

// Apply authentication middleware to all routes
router.use(verifyToken, authorizeAdmin);

// Admin can create user (Doctor, Receptionist, Labtech, Pharmacist)
router.post('/create-user', controller.createUser);

// ✅ ROLE ROUTES
router.post('/roles', validate.validateRole, controller.createRole);
router.get('/roles', controller.getAllRoles);
router.get('/roles/:roleId', controller.getRoleById);
router.put('/roles/:roleId', validate.validateRole, controller.updateRole);
router.patch('/roles/:roleId/deactivate', controller.deactivateRole);

// ✅ STAFF ROUTES
router.post('/staff', validate.validateStaff, controller.createStaff);
router.get('/staff', controller.getAllStaff);
router.get('/staff/:id', controller.getStaff);
router.put('/staff/:identifier', controller.updateStaff);
router.patch('/staff/:identifier', controller.deactivateStaff);

// ✅ SPECIALIZATION ROUTES
router.post('/specializations', validate.validateSpecialization, controller.createSpecialization);
router.get('/specializations', controller.getAllSpecializations);
router.get('/specializations/:specializationId', controller.getSpecializationById);
router.put('/specializations/:specializationId', validate.validateSpecialization, controller.updateSpecialization);

// ✅ DOCTOR ROUTES
router.post('/doctors', validate.validateDoctor, controller.createDoctor);
router.get('/doctors', controller.getAllDoctors);
router.get('/doctors/:doctorId', controller.getDoctorById);
router.put('/doctors/:doctorId', validate.validateDoctor, controller.updateDoctor);
router.patch('/doctors/:doctorId/deactivate', controller.deactivateDoctor);

module.exports = router;
