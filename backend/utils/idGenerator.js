const { Patient } = require('../models/receptionist');

// Generate unique patient ID
const generatePatientId = async () => {
  try {
    // Get the current year
    const currentYear = new Date().getFullYear();
    
    // Find the last patient with the current year prefix
    const lastPatient = await Patient.findOne({
      patientId: { $regex: `^P${currentYear}` }
    }).sort({ patientId: -1 });
    
    let sequence = 1;
    
    if (lastPatient) {
      // Extract the sequence number from the last patient ID
      const lastSequence = parseInt(lastPatient.patientId.slice(-4));
      sequence = lastSequence + 1;
    }
    
    // Format: P20240001, P20240002, etc.
    const patientId = `P${currentYear}${sequence.toString().padStart(4, '0')}`;
    
    return patientId;
  } catch (error) {
    console.error('Error generating patient ID:', error);
    throw new Error('Failed to generate patient ID');
  }
};

// Generate unique appointment ID
const generateAppointmentId = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    
    // Find the last appointment with the current year/month prefix
    const { Appointment } = require('../models/receptionist');
    const lastAppointment = await Appointment.findOne({
      appointmentId: { $regex: `^APT${currentYear}${currentMonth}` }
    }).sort({ appointmentId: -1 });
    
    let sequence = 1;
    
    if (lastAppointment) {
      const lastSequence = parseInt(lastAppointment.appointmentId.slice(-4));
      sequence = lastSequence + 1;
    }
    
    // Format: APT2024010001, APT2024010002, etc.
    const appointmentId = `APT${currentYear}${currentMonth}${sequence.toString().padStart(4, '0')}`;
    
    return appointmentId;
  } catch (error) {
    console.error('Error generating appointment ID:', error);
    throw new Error('Failed to generate appointment ID');
  }
};

// Generate unique billing ID
const generateBillingId = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    
    // Find the last billing with the current year/month prefix
    const { Billing } = require('../models/receptionist');
    const lastBilling = await Billing.findOne({
      billingId: { $regex: `^BILL${currentYear}${currentMonth}` }
    }).sort({ billingId: -1 });
    
    let sequence = 1;
    
    if (lastBilling) {
      const lastSequence = parseInt(lastBilling.billingId.slice(-4));
      sequence = lastSequence + 1;
    }
    
    // Format: BILL2024010001, BILL2024010002, etc.
    const billingId = `BILL${currentYear}${currentMonth}${sequence.toString().padStart(4, '0')}`;
    
    return billingId;
  } catch (error) {
    console.error('Error generating billing ID:', error);
    throw new Error('Failed to generate billing ID');
  }
};

// Generate unique prescription ID
const generatePrescriptionId = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    
    // Find the last prescription with the current year/month prefix
    const { MedicinePrescription } = require('../models/doctor');
    const lastPrescription = await MedicinePrescription.findOne({
      prescriptionId: { $regex: `^MED${currentYear}${currentMonth}` }
    }).sort({ prescriptionId: -1 });
    
    let sequence = 1;
    
    if (lastPrescription) {
      const lastSequence = parseInt(lastPrescription.prescriptionId.slice(-4));
      sequence = lastSequence + 1;
    }
    
    // Format: MED2024010001, MED2024010002, etc.
    const prescriptionId = `MED${currentYear}${currentMonth}${sequence.toString().padStart(4, '0')}`;
    
    return prescriptionId;
  } catch (error) {
    console.error('Error generating prescription ID:', error);
    throw new Error('Failed to generate prescription ID');
  }
};

// Generate unique lab prescription ID
const generateLabPrescriptionId = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    
    // Find the last lab prescription with the current year/month prefix
    const { LabTestPrescription } = require('../models/doctor');
    const lastLabPrescription = await LabTestPrescription.findOne({
      labPrescriptionId: { $regex: `^LAB${currentYear}${currentMonth}` }
    }).sort({ labPrescriptionId: -1 });
    
    let sequence = 1;
    
    if (lastLabPrescription) {
      const lastSequence = parseInt(lastLabPrescription.labPrescriptionId.slice(-4));
      sequence = lastSequence + 1;
    }
    
    // Format: LAB2024010001, LAB2024010002, etc.
    const labPrescriptionId = `LAB${currentYear}${currentMonth}${sequence.toString().padStart(4, '0')}`;
    
    return labPrescriptionId;
  } catch (error) {
    console.error('Error generating lab prescription ID:', error);
    throw new Error('Failed to generate lab prescription ID');
  }
};

// Generate unique lab test result ID
const generateLabTestResultId = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    
    // Find the last lab test result with the current year/month prefix
    const { LabTestResult } = require('../models/labtechnician');
    const lastLabTestResult = await LabTestResult.findOne({
      resultId: { $regex: `^RESULT${currentYear}${currentMonth}` }
    }).sort({ resultId: -1 });
    
    let sequence = 1;
    
    if (lastLabTestResult) {
      const lastSequence = parseInt(lastLabTestResult.resultId.slice(-4));
      sequence = lastSequence + 1;
    }
    
    // Format: RESULT2024010001, RESULT2024010002, etc.
    const resultId = `RESULT${currentYear}${currentMonth}${sequence.toString().padStart(4, '0')}`;
    
    return resultId;
  } catch (error) {
    console.error('Error generating lab test result ID:', error);
    throw new Error('Failed to generate lab test result ID');
  }
};

module.exports = {
  generatePatientId,
  generateAppointmentId,
  generateBillingId,
  generatePrescriptionId,
  generateLabPrescriptionId,
  generateLabTestResultId
}; 