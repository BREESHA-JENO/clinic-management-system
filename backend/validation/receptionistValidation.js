const { body, param, query, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// ==================== PATIENT VALIDATION ====================
const validateRegisterPatient = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\.\-']+$/)
    .withMessage('Name can only contain letters, spaces, periods, hyphens, and apostrophes'),
  body('dob')
    .isISO8601()
    .withMessage('Date of birth must be a valid date')
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 0 || age > 120) {
        throw new Error('Date of birth must be valid (age between 0-120)');
      }
      return true;
    }),
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('bloodGroup')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Blood group must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
  validate
];
const validateUpdatePatient = [
  param('patientId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Patient ID is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\.\-']+$/)
    .withMessage('Name can only contain letters, spaces, periods, hyphens, and apostrophes'),
  body('dob')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date')
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 0 || age > 120) {
        throw new Error('Date of birth must be valid (age between 0-120)');
      }
      return true;
    }),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('bloodGroup')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Blood group must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-'),
  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
  validate
];
const validatePatientId = [
  param('patientId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Patient ID is required'),
  validate
];
const validateListPatients = [
  query('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search term cannot be empty'),
  validate
];
// ==================== DOCTOR VALIDATION ====================
const validateRegisterDoctor = [
  body('doctorId')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Doctor ID must be between 3 and 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Doctor ID can only contain uppercase letters and numbers'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\.\-']+$/)
    .withMessage('Name can only contain letters, spaces, periods, hyphens, and apostrophes'),
  body('specialization')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Specialization must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email must be a valid email address'),
  body('phone')
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Phone number can only contain digits, spaces, hyphens, and parentheses'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
  validate
];
const validateUpdateDoctor = [
  param('doctorId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Doctor ID is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\.\-']+$/)
    .withMessage('Name can only contain letters, spaces, periods, hyphens, and apostrophes'),
  body('specialization')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Specialization must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email must be a valid email address'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Phone number can only contain digits, spaces, hyphens, and parentheses'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
  validate
];
const validateDoctorId = [
  param('doctorId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Doctor ID is required'),
  validate
];
const validateListDoctors = [
  query('isActive')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('isActive must be true or false'),
  query('specialization')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Specialization cannot be empty'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search term cannot be empty'),
  validate
];
// ==================== APPOINTMENT VALIDATION ====================
const validateScheduleAppointment = [
  body('patientId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Patient ID is required'),
  body('doctorId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Doctor ID is required'),
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid date')
    .custom((value) => {
      const appointmentDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (appointmentDate < today) {
        throw new Error('Appointment date cannot be in the past');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(['scheduled', 'confirmed', 'completed', 'cancelled'])
    .withMessage('Status must be scheduled, confirmed, completed, or cancelled'),
  validate
];
const validateUpdateAppointment = [
  param('appointmentId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Appointment ID is required'),
  body('patientId')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Patient ID cannot be empty'),
  body('doctorId')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Doctor ID cannot be empty'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date')
    .custom((value) => {
      const appointmentDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (appointmentDate < today) {
        throw new Error('Appointment date cannot be in the past');
      }
      return true;
    }),
  body('status')
    .optional()
    .isIn(['scheduled', 'confirmed', 'completed', 'cancelled'])
    .withMessage('Status must be scheduled, confirmed, completed, or cancelled'),
  validate
];
const validateAppointmentId = [
  param('appointmentId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Appointment ID is required'),
  validate
];
const validateListAppointments = [
  query('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date'),
  query('status')
    .optional()
    .isIn(['scheduled', 'confirmed', 'completed', 'cancelled'])
    .withMessage('Status must be scheduled, confirmed, completed, or cancelled'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  validate
];
// ==================== BILLING VALIDATION ====================
const validateGenerateBill = [
  body('appointmentId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Appointment ID is required'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date'),
  body('status')
    .optional()
    .isIn(['pending', 'paid', 'cancelled'])
    .withMessage('Status must be pending, paid, or cancelled'),
  validate
];
const validateUpdateBill = [
  param('appointmentId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Appointment ID is required'),
  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date'),
  body('status')
    .optional()
    .isIn(['pending', 'paid', 'cancelled'])
    .withMessage('Status must be pending, paid, or cancelled'),
  validate
];
const validateListBills = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (req.query.startDate) {
        const startDate = new Date(req.query.startDate);
        const endDate = new Date(value);
        if (endDate < startDate) {
          throw new Error('End date cannot be before start date');
        }
      }
      return true;
    }),
  query('status')
    .optional()
    .isIn(['pending', 'paid', 'cancelled'])
    .withMessage('Status must be pending, paid, or cancelled'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  validate
];
const validateRecordPayment = [
  param('appointmentId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Appointment ID is required'),
  body('paymentAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Payment amount must be a positive number'),
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'card', 'insurance', 'online'])
    .withMessage('Payment method must be cash, card, insurance, or online'),
  validate
];

module.exports = {
  // Patient validation
  validateRegisterPatient,
  validateUpdatePatient,
  validatePatientId,
  validateListPatients,
  // Doctor validation
  validateRegisterDoctor,
  validateUpdateDoctor,
  validateDoctorId,
  validateListDoctors,
  // Appointment validation
  validateScheduleAppointment,
  validateUpdateAppointment,
  validateAppointmentId,
  validateListAppointments,
  // Billing validation
  validateGenerateBill,
  validateUpdateBill,
  validateListBills,
  validateRecordPayment
};
