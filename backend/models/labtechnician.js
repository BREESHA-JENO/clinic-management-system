const mongoose = require('mongoose');

// Lab Test Schema
const LabTestSchema = new mongoose.Schema({
  testId: { type: String, required: true, unique: true },
  testName: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

<<<<<<< HEAD
// Lab Test Prescription Schema
const LabTestPrescriptionSchema = new mongoose.Schema({
=======
// Lab Test Prescription Item Schema
const LabTestPrescriptionItemSchema = new mongoose.Schema({
>>>>>>> d890af73c091528a847f4dd611078c653778c3e1
  appointmentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Appointment' },
  labTestId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'LabTest' },
  prescribedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  prescribedDoctorName: { type: String, required: true },
  prescribedDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Lab Test Result Schema
const LabTestResultSchema = new mongoose.Schema({
  resultId: { type: String, required: true, unique: true },
<<<<<<< HEAD
  labTestPrescriptionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'LabTestPrescription' },
=======
  labTestPrescriptionItemId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'LabTestPrescriptionItem' },
>>>>>>> d890af73c091528a847f4dd611078c653778c3e1
  testId: { type: String, required: true }, // Reference to LabTest testId
  result: { type: String, required: true },
  currentValue: { type: Number, required: true },
  minRange: { type: Number, required: true },
  maxRange: { type: Number, required: true },
  unit: { type: String, required: true }, // e.g., mg/dL, mmol/L, etc.
  price: { type: Number, required: true }, // Price from LabTest
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'LabTechnician' },
  recordedByTechnicianName: { type: String, required: true },
  recordedAt: { type: Date, default: Date.now },
  resultDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['normal', 'high', 'low', 'critical'], default: 'normal' },
}, { timestamps: true });

const LabTest = mongoose.model('LabTest', LabTestSchema);
<<<<<<< HEAD
const LabTestPrescription = mongoose.model('LabTestPrescription', LabTestPrescriptionSchema);
=======
const LabTestPrescriptionItem = mongoose.model('LabTestPrescriptionItem', LabTestPrescriptionItemSchema);
>>>>>>> d890af73c091528a847f4dd611078c653778c3e1
const LabTestResult = mongoose.model('LabTestResult', LabTestResultSchema);

module.exports = {
  LabTest,
<<<<<<< HEAD
  LabTestPrescription,
=======
  LabTestPrescriptionItem,
>>>>>>> d890af73c091528a847f4dd611078c653778c3e1
  LabTestResult,
};
