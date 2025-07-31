const { body, param } = require('express-validator');

// Medicine Validation
exports.validateMedicine = [
  body('name').notEmpty().withMessage('Medicine name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('manufacturer').optional().isString().withMessage('Manufacturer must be a string'),
];

// Medicine Inventory Validation
exports.validateInventory = [
  body('medicineId').notEmpty().withMessage('Medicine ID is required'),
  body('medicineName').notEmpty().withMessage('Medicine name is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
];

// Medicine Prescription Validation
exports.validateMedicinePrescription = [
  body('appointmentId').isMongoId().withMessage('Invalid appointment ID'),
  body('medicineId').notEmpty().withMessage('Medicine ID is required'),
  body('medicineName').notEmpty().withMessage('Medicine name is required'),
  body('dosage').notEmpty().withMessage('Dosage is required'),
  body('duration').notEmpty().withMessage('Duration is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('prescribedDoctorName').notEmpty().withMessage('Doctor name is required'),
  body('patientName').notEmpty().withMessage('Patient name is required'),
  body('patientAge').isInt({ min: 0, max: 150 }).withMessage('Patient age must be between 0 and 150'),
];

// Medicine Bill Validation
exports.validateMedicineBill = [
  body('prescriptionId').notEmpty().withMessage('Prescription ID is required'),
  body('patientName').notEmpty().withMessage('Patient name is required'),
  body('patientAge').isInt({ min: 0, max: 150 }).withMessage('Patient age must be between 0 and 150'),
  body('prescribedDoctorName').notEmpty().withMessage('Doctor name is required'),
  body('medicines').isArray().withMessage('Medicines must be an array'),
  body('medicines.*.medicineId').notEmpty().withMessage('Medicine ID is required'),
  body('medicines.*.medicineName').notEmpty().withMessage('Medicine name is required'),
  body('medicines.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('medicines.*.unitPrice').isNumeric().withMessage('Unit price must be a number'),
  body('medicines.*.totalPrice').isNumeric().withMessage('Total price must be a number'),
  body('issuedBy').notEmpty().withMessage('Issued by field is required'),
  body('paymentMethod').isIn(['cash', 'card', 'insurance']).withMessage('Invalid payment method'),
];
