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
};
