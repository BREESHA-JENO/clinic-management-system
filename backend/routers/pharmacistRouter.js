const express = require('express');
const router = express.Router();
const pharmacistController = require('../controllers/pharmacistController');
router.post('/', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  // Logic to create or validate doctor user
  res.status(201).json({ message: 'pharmacist login or creation successful' });
});

// Medicine Management
router.post('/medicines', pharmacistController.addMedicine);
router.put('/medicines/:medicineId', pharmacistController.updateMedicine);
router.get('/medicines/:medicineId', pharmacistController.getMedicineById);
router.get('/medicines', pharmacistController.listMedicines);
router.patch('/medicines/:medicineId/deactivate', pharmacistController.deactivateMedicine);

// Medicine Inventory Management
router.post('/inventory/medicine', pharmacistController.addInventoryItem);
router.put('/inventory/medicine/:medicineStockId', pharmacistController.updateInventoryQuantity);
router.get('/inventory/medicine/:medicineId', pharmacistController.getInventoryByMedicineId);
router.get('/inventory/medicine', pharmacistController.listInventoryItems);
router.patch('/inventory/medicine/:medicineStockId/flag-low', pharmacistController.flagLowStock);

// Medicine Prescription Management
router.post('/prescriptions', pharmacistController.createMedicinePrescription);
router.get('/prescriptions/:prescriptionId', pharmacistController.getMedicinePrescriptionById);
router.get('/prescriptions/patient/:patientName', pharmacistController.getPatientPrescriptions);

// Medicine Bill Management
router.post('/bills', pharmacistController.createMedicineBill);
router.get('/bills/:billId', pharmacistController.getMedicineBillById);
router.patch('/bills/:billId/payment', pharmacistController.updateBillPaymentStatus);

// Integration routes for Doctor module
router.get('/medicines/:medicineId', pharmacistController.getMedicineById);
router.get('/medicines/specialization/:specialization', pharmacistController.getMedicinesBySpecialization);
router.post('/process-prescription', pharmacistController.processDoctorPrescription);
router.get('/inventory/status', pharmacistController.getMedicineInventoryStatus);

module.exports = router;
