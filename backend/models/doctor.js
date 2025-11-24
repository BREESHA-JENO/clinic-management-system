const mongoose = require('mongoose');
const { generateCounterId } = require('../utils/idGenerator');

// ------------------------ Consultation Schema ------------------------
const ConsultationSchema = new mongoose.Schema({
  consultationId: { type: String, unique: true },
  appointmentId: { type: String, required: true }, // String ID from receptionist
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true }, // String ID from admin (staffId)
  symptoms: { type: String, required: true },
  diagnosis: { type: String, required: true },
  notes: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

ConsultationSchema.pre('save', async function (next) {
  if (this.consultationId) return next();

  try {
    this.consultationId = await generateCounterId('consultation', 'CONS');
    next();
  } catch (err) {
    next(err);
  }
});

// ------------------------ Medicine Prescription Schema ------------------------
const MedicinePrescriptionSchema = new mongoose.Schema({
  medicinePrescriptionId: { type: String, unique: true },
  appointmentId: { type: String, required: true }, // String ID from receptionist
  patientId: { type: String, required: true }, // String ID from receptionist
  doctorId: { type: String, required: true }, // String ID from admin (staffId)
  medicines: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  date: { type: Date, default: Date.now }
});

MedicinePrescriptionSchema.pre('save', async function (next) {
  if (this.medicinePrescriptionId) return next();

  try {
    this.medicinePrescriptionId = await generateCounterId('medicinePrescription', 'MEDP');
    next();
  } catch (err) {
    next(err);
  }
});

// ------------------------ Lab Test Prescription Schema ------------------------
const LabTestPrescriptionSchema = new mongoose.Schema({
  labTestPrescriptionId: { type: String, unique: true },
  appointmentId: { type: String, required: true }, // String ID from receptionist
  patientId: { type: String, required: true }, // String ID from receptionist
  doctorId: { type: String, required: true }, // String ID from admin (staffId)
  tests: [{
    name: String
  }],
  date: { type: Date, default: Date.now }
});

LabTestPrescriptionSchema.pre('save', async function (next) {
  if (this.labTestPrescriptionId) return next();

  try {
    this.labTestPrescriptionId = await generateCounterId('labTestPrescription', 'LTP');
    next();
  } catch (err) {
    next(err);
  }
});

// ------------------------ Export Models ------------------------
module.exports = {
  Consultation: mongoose.model('Consultation', ConsultationSchema),
  MedicinePrescription: mongoose.model('MedicinePrescription', MedicinePrescriptionSchema),
  LabTestPrescription: mongoose.model('LabTestPrescription', LabTestPrescriptionSchema)
};
