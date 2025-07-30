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

// ------------------------ Counter Schema ------------------------
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', counterSchema);

// ------------------------ Consultation Schema ------------------------
const ConsultationSchema = new mongoose.Schema({
  consultationId: { type: String, unique: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  symptoms: { type: String, required: true },
  diagnosis: { type: String, required: true },
  notes: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

ConsultationSchema.pre('save', async function (next) {
  if (this.consultationId) return next();

  try {
    const counter = await Counter.findOneAndUpdate(
      { name: 'consultation' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.consultationId = `CONS${String(counter.seq).padStart(3, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

// ------------------------ Medicine Prescription Schema ------------------------
const MedicinePrescriptionSchema = new mongoose.Schema({
  medicinePrescriptionId: { type: String, unique: true },
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

MedicinePrescriptionSchema.pre('save', async function (next) {
    console.log("hello");
  if (this.medicinePrescriptionId) return next();

  try {
    const counter = await Counter.findOneAndUpdate(
      { name: 'medicinePrescription' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.medicinePrescriptionId = `MEDP${String(counter.seq).padStart(3, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

// ------------------------ Lab Test Prescription Schema ------------------------
const LabTestPrescriptionSchema = new mongoose.Schema({
  labTestPrescriptionId: { type: String, unique: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  tests: [String],
  date: { type: Date, default: Date.now }
});

LabTestPrescriptionSchema.pre('save', async function (next) {
  if (this.labTestPrescriptionId) return next();

  try {
    const counter = await Counter.findOneAndUpdate(
      { name: 'labTestPrescription' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.labTestPrescriptionId = `LTP${String(counter.seq).padStart(3, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

// ------------------------ Export Models ------------------------
module.exports = {
  Consultation: mongoose.model('Consultation', ConsultationSchema),
  MedicinePrescription: mongoose.model('MedicinePrescription', MedicinePrescriptionSchema),
  LabTestPrescription: mongoose.model('LabTestPrescription', LabTestPrescriptionSchema),
  Counter // Optional: export this if you want to access/update counters directly elsewhere
};
