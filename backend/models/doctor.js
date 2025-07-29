// const mongoose = require('mongoose');

// const doctorSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     specialization: {
//         type: String,
//         required: true
//     },
//     phone: {
//         type: String,
//         required: true,
//         match: /^[6-9]\d{9}$/,
//         unique: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         match: /@(?:gmail|yahoo)\.com$/
//     },
//     consultationFee: {
//         type: Number,
//         required: true,
//         min: 100
//     },
//     isActive: {
//         type: Boolean,
//         default: true
//     }
// }, { timestamps: true });

// module.exports = mongoose.model('Doctor', doctorSchema);


const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    symptoms: { type: String, required: true },
    diagnosis: { type: String, required: true },
    notes: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const MedicinePrescriptionSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    medicines: [{
        name: String,
        dosage: String,
        frequency: String,
        duration: String
    }],
    date: { type: Date, default: Date.now }
});

const LabTestPrescriptionSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    tests: [String],
    date: { type: Date, default: Date.now }
});

module.exports = {
    Consultation: mongoose.model('Consultation', ConsultationSchema),
    MedicinePrescription: mongoose.model('MedicinePrescription', MedicinePrescriptionSchema),
    LabTestPrescription: mongoose.model('LabTestPrescription', LabTestPrescriptionSchema)
};
