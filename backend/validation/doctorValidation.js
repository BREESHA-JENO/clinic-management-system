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
    body('appointmentId').isMongoId().withMessage('Invalid appointment ID'),
    body('patientId').isMongoId().withMessage('Invalid patient ID'),
    body('symptoms').notEmpty().withMessage('Symptoms are required'),
    body('diagnosis').notEmpty().withMessage('Diagnosis is required'),
    body('notes').optional().isString(),
];

exports.validateMedicinePrescription = [
    body('appointmentId').isMongoId().withMessage('Invalid appointment ID'),
    body('patientId').isMongoId().withMessage('Invalid patient ID'),
    body('doctorId').isMongoId().withMessage('Invalid doctor ID'),
    body('medicines').isArray({ min: 1 }).withMessage('Medicines array must not be empty'),
    body('medicines.*.name').notEmpty().withMessage('Medicine name is required'),
    body('medicines.*.dosage').notEmpty().withMessage('Dosage is required'),
    body('medicines.*.duration').notEmpty().withMessage('Duration is required')
];


exports.validateLabTestPrescription = [
    body('appointmentId').isMongoId().withMessage('Invalid appointment ID'),
    body('patientId').isMongoId().withMessage('Invalid patient ID'),
    body('doctorId').isMongoId().withMessage('Invalid doctor ID'),
    body('tests').isArray({ min: 1 }).withMessage('Tests array must not be empty'),
    body('tests.*.name').notEmpty().withMessage('Test name is required')
];