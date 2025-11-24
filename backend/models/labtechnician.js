const mongoose = require('mongoose');

// Lab Test Schema
const LabTestSchema = new mongoose.Schema({
  testId: { type: String, required: true, unique: true },
  testName: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Lab Test Prescription Item Schema
const LabTestPrescriptionItemSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true }, // Use custom appointmentId string
  labTestId: { type: String, required: true }, // Use custom testId string
  prescribedBy: { type: String, required: true }, // Use custom doctorId string
  prescribedDoctorName: { type: String, required: true },
  prescribedDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Lab Test Result Schema
const LabTestResultSchema = new mongoose.Schema({
  resultId: { type: String, required: true, unique: true },
  labTestPrescriptionItemId: { type: String, required: true }, // Use custom prescriptionId string
  testId: { type: String, required: true }, // Reference to LabTest testId
  result: { type: String, required: true },
  currentValue: { type: Number, required: true },
  minRange: { type: Number, required: true },
  maxRange: { type: Number, required: true },
  unit: { type: String, required: true }, // e.g., mg/dL, mmol/L, etc.
  price: { type: Number, required: true }, // Price from LabTest
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  recordedBy: { type: String, required: true }, // Use custom technicianId string
  recordedByTechnicianName: { type: String, required: true },
  recordedAt: { type: Date, default: Date.now },
  resultDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['normal', 'high', 'low', 'critical'], default: 'normal' },
}, { timestamps: true });

const LabTest = mongoose.model('LabTest', LabTestSchema);
const LabTestPrescriptionItem = mongoose.model('LabTestPrescriptionItem', LabTestPrescriptionItemSchema);
const LabTestResult = mongoose.model('LabTestResult', LabTestResultSchema);

module.exports = {
  LabTest,
  LabTestPrescriptionItem,
  LabTestResult,
};
