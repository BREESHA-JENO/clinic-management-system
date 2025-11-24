const express = require('express');
const router = express.Router();
const pharmacistController = require('../controllers/pharmacistController');
const User = require('../models/user');
const { 
  generateRoleToken, 
  ROLES, 
  verifyToken, 
  authorizePharmacist 
} = require('../middleware/auth');


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username, role: 'pharmacist' });

    if (!user) {
      return res.status(404).json({ message: 'Pharmacist not found' });
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
    const token = generateRoleToken(user._id, ROLES.PHARMACIST, {
      username: user.username,
      name: user.name || 'Pharmacist'
    });

    res.status(200).json({ 
      success: true,
      message: 'Pharmacist login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: ROLES.PHARMACIST,
        name: user.name || 'Pharmacist'
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// Medicine Management (Protected Routes)
router.post('/medicines', verifyToken, authorizePharmacist, pharmacistController.addMedicine);
router.put('/medicines/:medicineId', verifyToken, authorizePharmacist, pharmacistController.updateMedicine);
router.get('/medicines/:medicineId', verifyToken, authorizePharmacist, pharmacistController.getMedicineById);
router.get('/medicines', verifyToken, authorizePharmacist, pharmacistController.listMedicines);
router.patch('/medicines/:medicineId/deactivate', verifyToken, authorizePharmacist, pharmacistController.deactivateMedicine);

// Medicine Inventory Management (Protected Routes)
router.post('/inventory/medicine', verifyToken, authorizePharmacist, pharmacistController.addInventoryItem);
router.put('/inventory/medicine/:medicineStockId', verifyToken, authorizePharmacist, pharmacistController.updateInventoryQuantity);
router.get('/inventory/medicine/:medicineId', verifyToken, authorizePharmacist, pharmacistController.getInventoryByMedicineId);
router.get('/inventory/medicine', verifyToken, authorizePharmacist, pharmacistController.listInventoryItems);
router.patch('/inventory/medicine/:medicineStockId/flag-low', verifyToken, authorizePharmacist, pharmacistController.flagLowStock);

// Medicine Prescription Management (Protected Routes)
router.post('/prescriptions', verifyToken, authorizePharmacist, pharmacistController.createMedicinePrescription);
router.get('/prescriptions/:prescriptionId', verifyToken, authorizePharmacist, pharmacistController.getMedicinePrescriptionById);
router.get('/prescriptions/patient/:patientName', verifyToken, authorizePharmacist, pharmacistController.getPatientPrescriptions);

// Medicine Bill Management (Protected Routes)
router.post('/bills', verifyToken, authorizePharmacist, pharmacistController.createMedicineBill);
router.get('/bills/:billId', verifyToken, authorizePharmacist, pharmacistController.getMedicineBillById);
router.patch('/bills/:billId/payment', verifyToken, authorizePharmacist, pharmacistController.updateBillPaymentStatus);

// Integration routes for Doctor module (Protected Routes)
router.get('/medicines/:medicineId', verifyToken, authorizePharmacist, pharmacistController.getMedicineById);
router.get('/medicines/specialization/:specialization', verifyToken, authorizePharmacist, pharmacistController.getMedicinesBySpecialization);
router.post('/process-prescription', verifyToken, authorizePharmacist, pharmacistController.processDoctorPrescription);
router.get('/inventory/status', verifyToken, authorizePharmacist, pharmacistController.getMedicineInventoryStatus);

// Specialization routes (Protected Routes)
router.get('/specializations', verifyToken, authorizePharmacist, pharmacistController.getAllSpecializations);
router.get('/specialization/:specializationName', verifyToken, authorizePharmacist, pharmacistController.getSpecializationByName);

// Cross-module integration routes (Protected Routes)
router.get('/doctor-prescriptions', verifyToken, authorizePharmacist, pharmacistController.getDoctorPrescriptions);
router.get('/doctor-lab-tests', verifyToken, authorizePharmacist, pharmacistController.getLabTestPrescriptions);

module.exports = router;
