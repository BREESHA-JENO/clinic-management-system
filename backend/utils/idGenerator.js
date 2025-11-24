const mongoose = require('mongoose');

// Generic ID generator function
const generateId = async (model, idField, prefix, yearMonth = false) => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    
    let searchPattern;
    if (yearMonth) {
      searchPattern = { $regex: `^${prefix}${currentYear}${currentMonth}` };
    } else {
      searchPattern = { $regex: `^${prefix}${currentYear}` };
    }
    
    const lastRecord = await model.findOne({ [idField]: searchPattern })
      .sort({ [idField]: -1 });
    
    let sequence = 1;
    
    if (lastRecord) {
      const lastSequence = parseInt(lastRecord[idField].slice(-4));
      sequence = lastSequence + 1;
    }
    
    const id = yearMonth 
      ? `${prefix}${currentYear}${currentMonth}${sequence.toString().padStart(4, '0')}`
      : `${prefix}${currentYear}${sequence.toString().padStart(4, '0')}`;
    
    return id;
  } catch (error) {
    console.error(`Error generating ${idField}:`, error);
    throw new Error(`Failed to generate ${idField}`);
  }
};

// Patient ID generator
const generatePatientId = async () => {
  const { Patient } = require('../models/receptionist');
  return generateId(Patient, 'patientId', 'P', false);
};

// Appointment ID generator
const generateAppointmentId = async () => {
  const { Appointment } = require('../models/receptionist');
  return generateId(Appointment, 'appointmentId', 'APT', true);
};

// Billing ID generator
const generateBillingId = async () => {
  const { Billing } = require('../models/receptionist');
  return generateId(Billing, 'billingId', 'BILL', true);
};

// Prescription ID generator
const generatePrescriptionId = async () => {
  const { MedicinePrescription } = require('../models/doctor');
  return generateId(MedicinePrescription, 'medicinePrescriptionId', 'MED', true);
};

// Lab prescription ID generator
const generateLabPrescriptionId = async () => {
  const { LabTestPrescription } = require('../models/doctor');
  return generateId(LabTestPrescription, 'labTestPrescriptionId', 'LAB', true);
};

// Lab test result ID generator
const generateLabTestResultId = async () => {
  const { LabTestResult } = require('../models/labtechnician');
  return generateId(LabTestResult, 'resultId', 'RESULT', true);
};

// Counter-based ID generator for models that use counters
const generateCounterId = async (counterName, prefix) => {
  try {
    const Counter = require('../models/counter');
    const counter = await Counter.findOneAndUpdate(
      { name: counterName },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    return `${prefix}${String(counter.seq).padStart(3, '0')}`;
  } catch (error) {
    console.error(`Error generating counter ID for ${counterName}:`, error);
    throw new Error(`Failed to generate ${counterName} ID`);
  }
};

module.exports = {
  generateId,
  generatePatientId,
  generateAppointmentId,
  generateBillingId,
  generatePrescriptionId,
  generateLabPrescriptionId,
  generateLabTestResultId,
  generateCounterId
}; 