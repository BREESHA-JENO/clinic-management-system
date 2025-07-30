const { body } = require('express-validator');

/* =======================================================
   STAFF VALIDATION
======================================================= */
exports.validateStaff = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').matches(/@.*\.com$/).withMessage('Email must be valid and end with .com'),
    body('phone').matches(/^[6-9]\d{9}$/).withMessage('Mobile must start with 6-9 and have 10 digits'),
    body('dob').notEmpty().withMessage('Date of Birth is required').isISO8601().withMessage('Invalid DOB format'),
    body('role').notEmpty().withMessage('Role ID is required')
];

/* =======================================================
   ROLE VALIDATION
======================================================= */
exports.validateRole = [
    body('name').notEmpty().withMessage('Role name is required'),
    body('description').optional().isString().withMessage('Description must be a string')
];

/* =======================================================
   SPECIALIZATION VALIDATION
======================================================= */
exports.validateSpecialization = [
    body('name').notEmpty().withMessage('Specialization name is required'),
    body('description').optional().isString()
];

/* =======================================================
   DOCTOR VALIDATION
======================================================= */
exports.validateDoctor = [
    body('staff').notEmpty().withMessage('Staff reference is required'),
    body('specialization').notEmpty().withMessage('Specialization ID is required'),
    body('workingDays').isArray({ min: 1 }).withMessage('Working days must be an array with at least one day'),
    body('workingHours.start').notEmpty().withMessage('Start time is required'),
    body('workingHours.end').notEmpty().withMessage('End time is required')
];
