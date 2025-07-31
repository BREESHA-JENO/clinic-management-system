const { body, param, query } = require('express-validator');

// Lab Test Validation
exports.validateLabTest = [
  body('testName').notEmpty().withMessage('Lab test name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('description').optional().isString().withMessage('Description must be a string'),
];

// Lab Test Result Validation
exports.validateLabTestResult = [
  param('labTestPrescriptionId').isMongoId().withMessage('Invalid prescription ID'),
  body('result').notEmpty().withMessage('Result is required'),
  body('currentValue').isNumeric().withMessage('Current value must be a number'),
  body('minRange').isNumeric().withMessage('Minimum range must be a number'),
  body('maxRange').isNumeric().withMessage('Maximum range must be a number'),
  body('unit').notEmpty().withMessage('Unit is required'),
  body('patientName').notEmpty().withMessage('Patient name is required'),
  body('patientAge').isNumeric().withMessage('Patient age must be a number'),
  body('recordedByTechnicianName').notEmpty().withMessage('Technician name is required'),
];

// Date Range Validation
exports.validateDateRange = [
  query('startDate').isISO8601().withMessage('Invalid start date'),
  query('endDate').isISO8601().withMessage('Invalid end date'),
];
