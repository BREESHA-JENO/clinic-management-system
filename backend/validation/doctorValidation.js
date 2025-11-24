// const Joi = require('joi');

// const doctorValidationSchema = Joi.object({
//     name: Joi.string().regex(/^[A-Za-z ]+$/).required(),
//     specialization: Joi.string().required(),
//     phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
//     email: Joi.string().email().pattern(/@(?:gmail|yahoo)\.com$/).required(),
//     consultationFee: Joi.number().min(100).required()
// });

// module.exports = {
//     validateDoctor: (data) => doctorValidationSchema.validate(data)
// };

const { body } = require('express-validator');

exports.validateConsultation = [
    body('appointmentId').notEmpty().withMessage('Appointment ID is required'),
    body('patientId').notEmpty().withMessage('Patient ID is required'),
    body('doctorId').notEmpty().withMessage('Doctor ID is required'),
    body('symptoms').notEmpty().withMessage('Symptoms are required'),
    body('diagnosis').notEmpty().withMessage('Diagnosis is required'),
    body('notes').optional().isString(),
];

exports.validateMedicinePrescription = [
    body('appointmentId').notEmpty().withMessage('Appointment ID is required'),
    body('patientId').notEmpty().withMessage('Patient ID is required'),
    body('doctorId').notEmpty().withMessage('Doctor ID is required'),
    body('medicines').isArray({ min: 1 }).withMessage('Medicines array must not be empty'),
    body('medicines.*.name').notEmpty().withMessage('Medicine name is required'),
    body('medicines.*.dosage').notEmpty().withMessage('Dosage is required'),
    body('medicines.*.duration').notEmpty().withMessage('Duration is required')
];


exports.validateLabTestPrescription = [
    body('appointmentId').notEmpty().withMessage('Appointment ID is required'),
    body('patientId').notEmpty().withMessage('Patient ID is required'),
    body('doctorId').notEmpty().withMessage('Doctor ID is required'),
    body('tests').isArray({ min: 1 }).withMessage('Tests array must not be empty'),
    body('tests.*.name').notEmpty().withMessage('Test name is required')
];