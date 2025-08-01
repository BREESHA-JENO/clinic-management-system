const { MedicinePrescription, LabTestPrescription } = require('../models/doctor');
const { Appointment, Patient, Doctor } = require('../models/receptionist');
const { LabTestResult } = require('../models/labtechnician');
const { generatePrescriptionId, generateLabPrescriptionId } = require('../utils/idGenerator');

// ==================== MEDICINE PRESCRIPTION ====================

// Create Medicine Prescription
const createMedicinePrescription = async (req, res) => {
  try {
    const { appointmentId, patientId, doctorId, details, status } = req.body;

    // Auto-generate unique prescription ID
    const prescriptionId = await generatePrescriptionId();

    // Check if appointment exists
    const appointment = await Appointment.findOne({ appointmentId });
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if patient exists
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findOne({ doctorId });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const prescription = new MedicinePrescription({
      prescriptionId,
      appointmentId,
      patientId,
      doctorId,
      details,
      status: status || 'active'
    });

    await prescription.save();

    res.status(201).json({
      success: true,
      message: 'Medicine prescription created successfully',
      data: prescription
    });
  } catch (error) {
    console.error('Error creating medicine prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating medicine prescription',
      error: error.message
    });
  }
};

// Update Medicine Prescription
const updateMedicinePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const updateData = req.body;

    const prescription = await MedicinePrescription.findOneAndUpdate(
      { prescriptionId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Medicine prescription not found'
      });
    }

    res.json({
      success: true,
      message: 'Medicine prescription updated successfully',
      data: prescription
    });
  } catch (error) {
    console.error('Error updating medicine prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating medicine prescription',
      error: error.message
    });
  }
};

// Get Medicine Prescription by Appointment ID
const getMedicinePrescriptionByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const prescription = await MedicinePrescription.findOne({ appointmentId });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Medicine prescription not found'
      });
    }

    res.json({
      success: true,
      data: prescription
    });
  } catch (error) {
    console.error('Error getting medicine prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting medicine prescription',
      error: error.message
    });
  }
};

// List Medicine Prescriptions by Patient
const listMedicinePrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const prescriptions = await MedicinePrescription.find({ patientId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MedicinePrescription.countDocuments({ patientId });

    res.json({
      success: true,
      data: prescriptions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPrescriptions: total
      }
    });
  } catch (error) {
    console.error('Error listing medicine prescriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing medicine prescriptions',
      error: error.message
    });
  }
};

// ==================== LAB TEST PRESCRIPTION ====================

// Create Lab Test Prescription
const createLabTestPrescription = async (req, res) => {
  try {
    const { appointmentId, patientId, doctorId, testIds, status } = req.body;

    // Auto-generate unique lab prescription ID
    const labPrescriptionId = await generateLabPrescriptionId();

    // Check if appointment exists
    const appointment = await Appointment.findOne({ appointmentId });
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if patient exists
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findOne({ doctorId });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const prescription = new LabTestPrescription({
      labPrescriptionId,
      appointmentId,
      patientId,
      doctorId,
      testIds,
      status: status || 'pending'
    });

    await prescription.save();

    res.status(201).json({
      success: true,
      message: 'Lab test prescription created successfully',
      data: prescription
    });
  } catch (error) {
    console.error('Error creating lab test prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating lab test prescription',
      error: error.message
    });
  }
};

// Update Lab Test Prescription
const updateLabTestPrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const updateData = req.body;

    const prescription = await LabTestPrescription.findOneAndUpdate(
      { labPrescriptionId: prescriptionId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Lab test prescription not found'
      });
    }

    res.json({
      success: true,
      message: 'Lab test prescription updated successfully',
      data: prescription
    });
  } catch (error) {
    console.error('Error updating lab test prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating lab test prescription',
      error: error.message
    });
  }
};

// Get Lab Test Prescription by Appointment ID
const getLabTestPrescriptionByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const prescription = await LabTestPrescription.findOne({ appointmentId });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Lab test prescription not found'
      });
    }

    res.json({
      success: true,
      data: prescription
    });
  } catch (error) {
    console.error('Error getting lab test prescription:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting lab test prescription',
      error: error.message
    });
  }
};

// List Lab Test Prescriptions by Patient
const listLabTestPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const prescriptions = await LabTestPrescription.find({ patientId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LabTestPrescription.countDocuments({ patientId });

    res.json({
      success: true,
      data: prescriptions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPrescriptions: total
      }
    });
  } catch (error) {
    console.error('Error listing lab test prescriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing lab test prescriptions',
      error: error.message
    });
  }
};

// ==================== HISTORY ENDPOINTS ====================

// List Medicine Prescription History by Patient
const listMedicinePrescriptionHistoryByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const prescriptions = await MedicinePrescription.find({ patientId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MedicinePrescription.countDocuments({ patientId });

    res.json({
      success: true,
      data: prescriptions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPrescriptions: total
      }
    });
  } catch (error) {
    console.error('Error listing medicine prescription history:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing medicine prescription history',
      error: error.message
    });
  }
};

// List Medicine Prescription History by Doctor
const listMedicinePrescriptionHistoryByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const prescriptions = await MedicinePrescription.find({ doctorId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MedicinePrescription.countDocuments({ doctorId });

    res.json({
      success: true,
      data: prescriptions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPrescriptions: total
      }
    });
  } catch (error) {
    console.error('Error listing medicine prescription history:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing medicine prescription history',
      error: error.message
    });
  }
};

// Get Medicine Prescription History by Appointment ID
const getMedicinePrescriptionHistoryByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const prescription = await MedicinePrescription.findOne({ appointmentId });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Medicine prescription not found'
      });
    }

    res.json({
      success: true,
      data: prescription
    });
  } catch (error) {
    console.error('Error getting medicine prescription history:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting medicine prescription history',
      error: error.message
    });
  }
};

// ==================== LAB TEST RESULTS MANAGEMENT (DOCTOR) ====================

// List Lab Test Results Sent to Doctor
const listLabTestResultsForDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { doctorId };
    if (status) {
      query.status = status;
    }

    const labTestResults = await LabTestResult.find(query)
      .sort({ sentToDoctorDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LabTestResult.countDocuments(query);

    res.json({
      success: true,
      data: labTestResults,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalResults: total
      }
    });
  } catch (error) {
    console.error('Error listing lab test results for doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing lab test results for doctor',
      error: error.message
    });
  }
};

// Accept Lab Test Result
const acceptLabTestResult = async (req, res) => {
  try {
    const { resultId } = req.params;
    const { doctorNotes } = req.body;

    const labTestResult = await LabTestResult.findOneAndUpdate(
      { resultId },
      { 
        status: 'accepted_by_doctor',
        acceptedByDoctorDate: new Date(),
        doctorNotes: doctorNotes || ''
      },
      { new: true }
    );

    if (!labTestResult) {
      return res.status(404).json({
        success: false,
        message: 'Lab test result not found'
      });
    }

    res.json({
      success: true,
      message: 'Lab test result accepted successfully',
      data: labTestResult
    });
  } catch (error) {
    console.error('Error accepting lab test result:', error);
    res.status(500).json({
      success: false,
      message: 'Error accepting lab test result',
      error: error.message
    });
  }
};

// Reject Lab Test Result
const rejectLabTestResult = async (req, res) => {
  try {
    const { resultId } = req.params;
    const { doctorNotes } = req.body;

    const labTestResult = await LabTestResult.findOneAndUpdate(
      { resultId },
      { 
        status: 'rejected_by_doctor',
        acceptedByDoctorDate: new Date(),
        doctorNotes: doctorNotes || ''
      },
      { new: true }
    );

    if (!labTestResult) {
      return res.status(404).json({
        success: false,
        message: 'Lab test result not found'
      });
    }

    res.json({
      success: true,
      message: 'Lab test result rejected successfully',
      data: labTestResult
    });
  } catch (error) {
    console.error('Error rejecting lab test result:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting lab test result',
      error: error.message
    });
  }
};

// Get Lab Test Result by ID (for doctor)
const getLabTestResultById = async (req, res) => {
  try {
    const { resultId } = req.params;

    const labTestResult = await LabTestResult.findOne({ resultId });

    if (!labTestResult) {
      return res.status(404).json({
        success: false,
        message: 'Lab test result not found'
      });
    }

    res.json({
      success: true,
      data: labTestResult
    });
  } catch (error) {
    console.error('Error getting lab test result:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting lab test result',
      error: error.message
    });
  }
};

// Health Check
const healthCheck = async (req, res) => {
  res.json({
    success: true,
    message: 'Doctor API is running',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  // Medicine Prescription
  createMedicinePrescription,
  updateMedicinePrescription,
  getMedicinePrescriptionByAppointmentId,
  listMedicinePrescriptionsByPatient,
  
  // Lab Test Prescription
  createLabTestPrescription,
  updateLabTestPrescription,
  getLabTestPrescriptionByAppointmentId,
  listLabTestPrescriptionsByPatient,
  
  // History
  listMedicinePrescriptionHistoryByPatient,
  listMedicinePrescriptionHistoryByDoctor,
  getMedicinePrescriptionHistoryByAppointmentId,
  
  // Lab Test Results Management (Doctor)
  listLabTestResultsForDoctor,
  acceptLabTestResult,
  rejectLabTestResult,
  getLabTestResultById,
  
  // Health Check
  healthCheck
};
