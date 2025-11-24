const { Consultation, MedicinePrescription, LabTestPrescription } = require('../models/doctor');
const { Appointment, Patient, Doctor } = require('../models/receptionist');
const { Staff } = require('../models/admin');
const { LabTestResult } = require('../models/labtechnician');
const { generatePrescriptionId, generateLabPrescriptionId } = require('../utils/idGenerator');

// ==================== CONSULTATION ====================

exports.addConsultationNote = async (req, res) => {
    try {
        const { appointmentId, patientId, doctorId, symptoms, diagnosis, notes } = req.body;

        // Validate that appointment exists
        const appointment = await Appointment.findOne({ appointmentId });
        if (!appointment) {
            return res.status(404).json({ 
                success: false, 
                message: 'Appointment not found' 
            });
        }

        // Validate that patient exists
        const patient = await Patient.findOne({ patientId });
        if (!patient) {
            return res.status(404).json({ 
                success: false, 
                message: 'Patient not found' 
            });
        }

        // Validate that doctor exists
        const doctor = await Staff.findOne({ staffId: doctorId });
        if (!doctor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Doctor not found' 
            });
        }

        // Create consultation with string IDs directly
        const consultation = await Consultation.create({
            appointmentId: appointmentId, // String ID directly
            patientId: patientId, // Add patientId to the creation
            doctorId: doctorId, // String ID directly
            symptoms,
            diagnosis,
            notes: notes || 'No additional notes'
        });

        // Create response with string IDs
        const responseData = {
            _id: consultation._id,
            consultationId: consultation.consultationId,
            appointmentId: consultation.appointmentId,
            patientId: consultation.patientId,
            doctorId: consultation.doctorId,
            symptoms: consultation.symptoms,
            diagnosis: consultation.diagnosis,
            notes: consultation.notes,
            date: consultation.date
        };

        res.status(201).json({
            success: true,
            message: 'Consultation created successfully',
            data: responseData
        });
    } catch (err) {
        res.status(400).json({ 
            success: false,
            message: 'Error creating consultation',
            error: err.message 
        });
    }
};

exports.updateConsultationNote = async (req, res) => {
    try {
        const { appointmentId, doctorId, symptoms, diagnosis, notes } = req.body;
        
        // Prepare update data
        const updateData = {};
        
        // Only include fields that are provided
        if (symptoms !== undefined) updateData.symptoms = symptoms;
        if (diagnosis !== undefined) updateData.diagnosis = diagnosis;
        if (notes !== undefined) updateData.notes = notes;
        
        // Handle appointmentId validation if provided
        if (appointmentId) {
            const appointment = await Appointment.findOne({ appointmentId });
            if (!appointment) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Appointment not found' 
                });
            }
            updateData.appointmentId = appointmentId; // Use string ID directly
        }
        
        // Handle doctorId validation if provided
        if (doctorId) {
            const doctor = await Staff.findOne({ staffId: doctorId });
            if (!doctor) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Doctor not found' 
                });
            }
            updateData.doctorId = doctorId; // Use string ID directly
        }
        
        // Find and update consultation by consultationId string
        const consultation = await Consultation.findOneAndUpdate(
            { consultationId: req.params.id }, 
            updateData, 
            { new: true }
        );
        
        if (!consultation) {
            return res.status(404).json({ 
                success: false,
                message: 'Consultation not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Consultation updated successfully',
            data: consultation
        });
    } catch (err) {
        res.status(400).json({ 
            success: false,
            message: 'Error updating consultation',
            error: err.message 
        });
    }
};

exports.getConsultationByAppointment = async (req, res) => {
    try {
        // Validate that appointment exists
        const appointment = await Appointment.findOne({ appointmentId: req.params.appointmentId });
        if (!appointment) {
            return res.status(404).json({ 
                success: false, 
                message: "Appointment not found" 
            });
        }

        // Find consultation using string appointmentId directly
        const consultation = await Consultation.findOne({ appointmentId: req.params.appointmentId });

        if (!consultation) {
            return res.status(404).json({ 
                success: false, 
                message: "Consultation not found" 
            });
        }

        // Create response with string IDs
        const responseData = {
            _id: consultation._id,
            consultationId: consultation.consultationId,
            appointmentId: consultation.appointmentId,
            patientId: appointment.patientId, // Get from appointment
            doctorId: consultation.doctorId,
            symptoms: consultation.symptoms,
            diagnosis: consultation.diagnosis,
            notes: consultation.notes,
            date: consultation.date
        };

        res.json({
            success: true,
            data: responseData
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

exports.listConsultationsByDoctor = async (req, res) => {
    try {
        // Validate that doctor exists
        const doctor = await Staff.findOne({ staffId: req.params.doctorId });
        if (!doctor) {
            return res.status(404).json({ 
                success: false, 
                message: "Doctor not found" 
            });
        }

        // Find consultations using string doctorId directly
        const consultations = await Consultation.find({ doctorId: req.params.doctorId });

        // Create response with string IDs
        const responseData = consultations.map(consultation => ({
            _id: consultation._id,
            consultationId: consultation.consultationId,
            appointmentId: consultation.appointmentId,
            patientId: consultation.patientId, // Will need to get from appointment if needed
            doctorId: consultation.doctorId,
            symptoms: consultation.symptoms,
            diagnosis: consultation.diagnosis,
            notes: consultation.notes,
            date: consultation.date
        }));

        res.json({
            success: true,
            data: responseData
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

// ==================== MEDICINE PRESCRIPTION ====================

exports.createMedicinePrescription = async (req, res) => {
    try {
        const { appointmentId, patientId, doctorId, medicines, status } = req.body;

        // Validate that appointment exists
        const appointment = await Appointment.findOne({ appointmentId });
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Validate that patient exists
        const patient = await Patient.findOne({ patientId });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        // Validate that doctor exists
        const doctor = await Staff.findOne({ staffId: doctorId });
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        // Create prescription with string IDs directly
        const prescription = await MedicinePrescription.create({
            appointmentId: appointmentId, // String ID directly
            patientId: patientId, // String ID directly
            doctorId: doctorId, // String ID directly
            medicines: medicines || [],
            status: status || 'active'
        });

        // Create response with string IDs
        const responseData = {
            _id: prescription._id,
            medicinePrescriptionId: prescription.medicinePrescriptionId,
            appointmentId: prescription.appointmentId,
            patientId: prescription.patientId,
            doctorId: prescription.doctorId,
            medicines: prescription.medicines,
            date: prescription.date
        };

        res.status(201).json({
            success: true,
            message: 'Medicine prescription created successfully',
            data: responseData
        });
    } catch (err) {
        res.status(400).json({ 
            success: false,
            message: 'Error creating medicine prescription',
            error: err.message 
        });
    }
};

exports.updateMedicinePrescription = async (req, res) => {
    try {
        const { appointmentId, patientId, doctorId, medicines, status } = req.body;
        
        // Prepare update data
        const updateData = {};
        
        // Only include fields that are provided
        if (medicines !== undefined) updateData.medicines = medicines;
        if (status !== undefined) updateData.status = status;
        
        // Handle appointmentId validation if provided
        if (appointmentId) {
            const appointment = await Appointment.findOne({ appointmentId });
            if (!appointment) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Appointment not found' 
                });
            }
            updateData.appointmentId = appointmentId; // Use string ID directly
        }
        
        // Handle patientId validation if provided
        if (patientId) {
            const patient = await Patient.findOne({ patientId });
            if (!patient) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Patient not found' 
                });
            }
            updateData.patientId = patientId; // Use string ID directly
        }
        
        // Handle doctorId validation if provided
        if (doctorId) {
            const doctor = await Staff.findOne({ staffId: doctorId });
            if (!doctor) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Doctor not found' 
                });
            }
            updateData.doctorId = doctorId; // Use string ID directly
        }
        
        // Find and update prescription by medicinePrescriptionId string
        const prescription = await MedicinePrescription.findOneAndUpdate(
            { medicinePrescriptionId: req.params.id }, 
            updateData, 
            { new: true }
        );
        
        if (!prescription) {
            return res.status(404).json({ 
                success: false,
                message: 'Prescription not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Medicine prescription updated successfully',
            data: prescription
        });
    } catch (err) {
        res.status(400).json({ 
            success: false,
            message: 'Error updating medicine prescription',
            error: err.message 
        });
    }
};

// Get medicine prescription by ID
exports.getMedicinePrescriptionById = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        
        // Find prescription by medicinePrescriptionId string
        const prescription = await MedicinePrescription.findOne({ 
            medicinePrescriptionId: prescriptionId 
        });
        
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
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: 'Error retrieving medicine prescription',
            error: err.message 
        });
    }
};

exports.getMedicineByAppointment = async (req, res) => {
    try {
        // Validate that appointment exists
        const appointment = await Appointment.findOne({ appointmentId: req.params.appointmentId });
        if (!appointment) {
            return res.status(404).json({ 
                success: false,
                message: 'Appointment not found' 
            });
        }

        // Find prescription using string appointmentId directly
        const prescription = await MedicinePrescription.findOne({ appointmentId: req.params.appointmentId });
        if (!prescription) {
            return res.status(404).json({ 
                success: false,
                message: 'Prescription not found' 
            });
        }
        
        res.json({
            success: true,
            data: prescription
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

exports.listMedicineByPatient = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const { patientId } = req.params;

        // Validate that patient exists
        const patient = await Patient.findOne({ patientId });
        if (!patient) {
            return res.status(404).json({ 
                success: false,
                message: 'Patient not found' 
            });
        }

        // Find prescriptions using string patientId directly
        const prescriptions = await MedicinePrescription.find({ patientId: patientId })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await MedicinePrescription.countDocuments({ patientId: patientId });

        res.json({
            success: true,
            data: prescriptions,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalPrescriptions: total
            }
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

exports.listMedicineHistoryByDoctor = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const { doctorId } = req.params;

        // Validate that doctor exists
        const doctor = await Staff.findOne({ staffId: doctorId });
        if (!doctor) {
            return res.status(404).json({ 
                success: false,
                message: 'Doctor not found' 
            });
        }

        // Find prescriptions using string doctorId directly
        const prescriptions = await MedicinePrescription.find({ doctorId: doctorId })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await MedicinePrescription.countDocuments({ doctorId: doctorId });

        res.json({
            success: true,
            data: prescriptions,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalPrescriptions: total
            }
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

// ==================== LAB TEST PRESCRIPTION ====================

exports.createLabTestPrescription = async (req, res) => {
    try {
        const { appointmentId, patientId, doctorId, tests, status } = req.body;

        // Validate that appointment exists
        const appointment = await Appointment.findOne({ appointmentId });
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Validate that patient exists
        const patient = await Patient.findOne({ patientId });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        // Validate that doctor exists
        const doctor = await Staff.findOne({ staffId: doctorId });
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        // Create lab test prescription with string IDs directly
        const test = await LabTestPrescription.create({
            appointmentId: appointmentId, // String ID directly
            patientId: patientId, // String ID directly
            doctorId: doctorId, // String ID directly
            tests: tests || [],
            status: status || 'pending'
        });

        // Create response with string IDs
        const responseData = {
            _id: test._id,
            labTestPrescriptionId: test.labTestPrescriptionId,
            appointmentId: test.appointmentId,
            patientId: test.patientId,
            doctorId: test.doctorId,
            tests: test.tests,
            date: test.date
        };

        res.status(201).json({
            success: true,
            message: 'Lab test prescription created successfully',
            data: responseData
        });
    } catch (err) {
        res.status(400).json({ 
            success: false,
            message: 'Error creating lab test prescription',
            error: err.message 
        });
    }
};

exports.updateLabTestPrescription = async (req, res) => {
    try {
        const { appointmentId, patientId, doctorId, tests, status } = req.body;
        
        // Prepare update data
        const updateData = {};
        
        // Only include fields that are provided
        if (tests !== undefined) updateData.tests = tests;
        if (status !== undefined) updateData.status = status;
        
        // Handle appointmentId validation if provided
        if (appointmentId) {
            const appointment = await Appointment.findOne({ appointmentId });
            if (!appointment) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Appointment not found' 
                });
            }
            updateData.appointmentId = appointmentId; // Use string ID directly
        }
        
        // Handle patientId validation if provided
        if (patientId) {
            const patient = await Patient.findOne({ patientId });
            if (!patient) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Patient not found' 
                });
            }
            updateData.patientId = patientId; // Use string ID directly
        }
        
        // Handle doctorId validation if provided
        if (doctorId) {
            const doctor = await Staff.findOne({ staffId: doctorId });
            if (!doctor) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Doctor not found' 
                });
            }
            updateData.doctorId = doctorId; // Use string ID directly
        }
        
        // Find and update lab test prescription by labTestPrescriptionId string
        const test = await LabTestPrescription.findOneAndUpdate(
            { labTestPrescriptionId: req.params.id }, 
            updateData, 
            { new: true }
        );
        
        if (!test) {
            return res.status(404).json({ 
                success: false,
                message: 'Lab test prescription not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Lab test prescription updated successfully',
            data: test
        });
    } catch (err) {
        res.status(400).json({ 
            success: false,
            message: 'Error updating lab test prescription',
            error: err.message 
        });
    }
};

// Get lab test prescription by ID
exports.getLabTestPrescriptionById = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        
        // Find prescription by labTestPrescriptionId string
        const prescription = await LabTestPrescription.findOne({ 
            labTestPrescriptionId: prescriptionId 
        });
        
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
    } catch (err) {
        res.status(500).json({ 
            success: false,
            message: 'Error retrieving lab test prescription',
            error: err.message 
        });
    }
};

exports.getLabTestByAppointment = async (req, res) => {
    try {
        // Validate that appointment exists
        const appointment = await Appointment.findOne({ appointmentId: req.params.appointmentId });
        if (!appointment) {
            return res.status(404).json({ 
                success: false,
                message: 'Appointment not found' 
            });
        }

        // Find lab test prescription using string appointmentId directly
        const test = await LabTestPrescription.findOne({ appointmentId: req.params.appointmentId });
        if (!test) {
            return res.status(404).json({ 
                success: false,
                message: 'Lab test prescription not found' 
            });
        }
        
        res.json({
            success: true,
            data: test
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

exports.listLabTestsByPatient = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const { patientId } = req.params;

        // Validate that patient exists
        const patient = await Patient.findOne({ patientId });
        if (!patient) {
            return res.status(404).json({ 
                success: false,
                message: 'Patient not found' 
            });
        }

        // Find lab test prescriptions using string patientId directly
        const tests = await LabTestPrescription.find({ patientId: patientId })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await LabTestPrescription.countDocuments({ patientId: patientId });

        res.json({
            success: true,
            data: tests,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalPrescriptions: total
            }
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

// ==================== LAB TEST RESULT MANAGEMENT ====================

exports.listLabTestResultsForDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { status, page = 1, limit = 10 } = req.query;

        // Validate that doctor exists
        const doctor = await Staff.findOne({ staffId: doctorId });
        if (!doctor) {
            return res.status(404).json({ 
                success: false,
                message: 'Doctor not found' 
            });
        }

        const query = { doctorId: doctorId }; // Use string ID directly
        if (status) query.status = status;

        const results = await LabTestResult.find(query)
            .sort({ sentToDoctorDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await LabTestResult.countDocuments(query);

        res.json({
            success: true,
            data: results,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalResults: total
            }
        });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
};

exports.acceptLabTestResult = async (req, res) => {
    try {
        const { resultId } = req.params;
        const { doctorNotes } = req.body;

        const result = await LabTestResult.findOneAndUpdate(
            { resultId },
            {
                status: 'accepted_by_doctor',
                acceptedByDoctorDate: new Date(),
                doctorNotes: doctorNotes || ''
            },
            { new: true }
        );

        if (!result) return res.status(404).json({ message: 'Lab test result not found' });

        res.json({ success: true, message: 'Accepted successfully', data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.rejectLabTestResult = async (req, res) => {
    try {
        const { resultId } = req.params;
        const { doctorNotes } = req.body;

        const result = await LabTestResult.findOneAndUpdate(
            { resultId },
            {
                status: 'rejected_by_doctor',
                acceptedByDoctorDate: new Date(),
                doctorNotes: doctorNotes || ''
            },
            { new: true }
        );

        if (!result) return res.status(404).json({ message: 'Lab test result not found' });

        res.json({ success: true, message: 'Rejected successfully', data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getLabTestResultById = async (req, res) => {
    try {
        const { resultId } = req.params;

        const result = await LabTestResult.findOne({ resultId });
        if (!result) return res.status(404).json({ message: 'Lab test result not found' });

        res.json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==================== HEALTH CHECK ====================

exports.healthCheck = async (req, res) => {
    res.json({
        success: true,
        message: 'Doctor API is running',
        timestamp: new Date().toISOString()
    });
};

// List Consultation History by Patient
exports.listConsultationHistoryByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const consultations = await Consultation.find({})
      .populate({
        path: 'appointmentId',
        match: { patientId },
      })
      .populate('doctorId', 'name specialization');

    const filteredConsultations = consultations.filter(c => c.appointmentId !== null);

    res.status(200).json(filteredConsultations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve consultation history by patient' });
  }
};

// Get Consultation History by Appointment ID
exports.getConsultationHistoryByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const consultation = await Consultation.findOne({ appointmentId })
      .populate('appointmentId')
      .populate('doctorId', 'name specialization');

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found for appointment' });
    }

    res.status(200).json(consultation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve consultation history by appointment ID' });
  }
};

// List Consultation History by Doctor
exports.listConsultationHistoryByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const consultations = await Consultation.find({ doctorId })
      .populate('appointmentId')
      .populate('doctorId', 'name specialization');

    res.status(200).json(consultations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve consultation history by doctor' });
  }
};
// ==================== CONSULTATION HISTORY ALIASES ====================

exports.listConsultationHistoryByPatient = exports.listMedicineByPatient;
exports.getConsultationHistoryByAppointment = exports.getConsultationByAppointment;
exports.listConsultationHistoryByDoctor = exports.listConsultationsByDoctor;
