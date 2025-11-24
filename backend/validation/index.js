// Unified validation index
const adminValidation = require('./adminValidation');
const doctorValidation = require('./doctorValidation');
const labtechnicianValidation = require('./labtechnicianValidation');
const pharmacistValidation = require('./pharmacistValidation');
const receptionistValidation = require('./receptionistValidation');

module.exports = {
  adminValidation,
  doctorValidation,
  labtechnicianValidation,
  pharmacistValidation,
  receptionistValidation
}; 