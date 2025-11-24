// Unified models index
const User = require('./user');
const { Role, Staff, Specialization, Doctor } = require('./admin');
const { Consultation, MedicinePrescription, LabTestPrescription } = require('./doctor');
const { Patient, Appointment, Billing } = require('./receptionist');
const { LabTest, LabTestPrescriptionItem, LabTestResult } = require('./labtechnician');
const { Medicine, MedicinePrescriptionItem, MedicineInventory, MedicineBill } = require('./pharmacist');
const Counter = require('./counter');

module.exports = {
  // User management
  User,
  
  // Admin models
  Role,
  Staff,
  Specialization,
  Doctor,
  
  // Doctor models
  Consultation,
  MedicinePrescription,
  LabTestPrescription,
  
  // Receptionist models
  Patient,
  Appointment,
  Billing,
  
  // Lab technician models
  LabTest,
  LabTestPrescriptionItem,
  LabTestResult,
  
  // Pharmacist models
  Medicine,
  MedicinePrescriptionItem,
  MedicineInventory,
  MedicineBill,
  
  // Utility models
  Counter
}; 