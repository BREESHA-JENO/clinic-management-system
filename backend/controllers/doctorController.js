<<<<<<< HEAD
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
=======
// const Doctor = require('../models/doctor');
// const { validateDoctor } = require('../validation/doctorValidation');

// // Create Doctor
// exports.createDoctor = async (req, res) => {
//     const { error } = validateDoctor(req.body);
//     if (error) return res.status(400).json({ message: error.details[0].message });

//     try {
//         const existing = await Doctor.findOne({ email: req.body.email });
//         if (existing) return res.status(400).json({ message: "Doctor already exists" });

//         const doctor = new Doctor(req.body);
//         await doctor.save();
//         res.status(201).json(doctor);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // Update Doctor
// exports.updateDoctor = async (req, res) => {
//     const { error } = validateDoctor(req.body);
//     if (error) return res.status(400).json({ message: error.details[0].message });

//     try {
//         const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updatedDoctor) return res.status(404).json({ message: "Doctor not found" });

//         res.json(updatedDoctor);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // Get Doctor by ID
// exports.getDoctorById = async (req, res) => {
//     try {
//         const doctor = await Doctor.findById(req.params.id);
//         if (!doctor) return res.status(404).json({ message: "Doctor not found" });
//         res.json(doctor);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // List All Doctors
// exports.listDoctors = async (req, res) => {
//     try {
//         const doctors = await Doctor.find();
//         res.json(doctors);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // Deactivate Doctor
// exports.deactivateDoctor = async (req, res) => {
//     try {
//         const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
//         if (!doctor) return res.status(404).json({ message: "Doctor not found" });
//         res.json({ message: "Doctor deactivated", doctor });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

const { Consultation, MedicinePrescription, LabTestPrescription } = require('../models/doctor');

// Consultation
exports.addConsultationNote = async (req, res) => {
    try {
        const consultation = await Consultation.create(req.body);
        res.status(201).json(consultation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateConsultationNote = async (req, res) => {
    try {
        const consultation = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(consultation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getConsultationByAppointment = async (req, res) => {
    try {
        const consultation = await Consultation.findOne({ appointmentId: req.params.appointmentId });
        res.json(consultation);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

exports.listConsultationsByDoctor = async (req, res) => {
    try {
        const consultations = await Consultation.find({ doctorId: req.params.doctorId });
        res.json(consultations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Medicine Prescription
exports.createMedicinePrescription = async (req, res) => {
    try {
        const prescription = await MedicinePrescription.create(req.body);
        res.status(201).json(prescription);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateMedicinePrescription = async (req, res) => {
    try {
        const prescription = await MedicinePrescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(prescription);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }   
};

exports.getMedicineByAppointment = async (req, res) => {
    try {
        const prescription = await MedicinePrescription.findOne({ appointmentId: req.params.appointmentId });
        res.json(prescription);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

exports.listMedicineByPatient = async (req, res) => {
    try {
        const prescriptions = await MedicinePrescription.find({ patientId: req.params.patientId });
        res.json(prescriptions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Lab Test Prescription
exports.createLabTestPrescription = async (req, res) => {
    try {
        const test = await LabTestPrescription.create(req.body);
        res.status(201).json(test);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateLabTestPrescription = async (req, res) => {
    try {
        const test = await LabTestPrescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(test);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getLabTestByAppointment = async (req, res) => {
    try {
        const test = await LabTestPrescription.findOne({ appointmentId: req.params.appointmentId });
        res.json(test);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

exports.listLabTestsByPatient = async (req, res) => {
    try {
        const tests = await LabTestPrescription.find({ patientId: req.params.patientId });
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Consultation & Prescription History
exports.listConsultationHistoryByPatient = exports.listMedicineByPatient;
exports.listConsultationHistoryByDoctor = exports.listConsultationsByDoctor;
exports.getConsultationHistoryByAppointment = exports.getConsultationByAppointment;
exports.listMedicineHistoryByDoctor = async (req, res) => {
    try {
        const prescriptions = await MedicinePrescription.find({ doctorId: req.params.doctorId });
        res.json(prescriptions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
>>>>>>> d890af73c091528a847f4dd611078c653778c3e1
};
