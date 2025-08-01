const mongoose = require('mongoose');

// Patient Schema
const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: [true, 'Patient ID is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: [true, 'Blood group is required']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    required: [true, 'Appointment ID is required'],
    unique: true,
    trim: true
  },
  patientId: {
    type: String,
    required: [true, 'Patient ID is required'],
    trim: true
  },
  doctorId: {
    type: String,
    required: [true, 'Doctor ID is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Billing Schema
const billingSchema = new mongoose.Schema({
  billingId: {
    type: String,
    required: [true, 'Billing ID is required'],
    unique: true,
    trim: true
  },
  appointmentId: {
    type: String,
    required: [true, 'Appointment ID is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  date: {
    type: Date,
    required: [true, 'Billing date is required'],
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
patientSchema.index({ name: 1 });
patientSchema.index({ status: 1 });

appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ doctorId: 1 });
appointmentSchema.index({ date: 1 });
appointmentSchema.index({ status: 1 });

billingSchema.index({ appointmentId: 1 });
billingSchema.index({ date: 1 });
billingSchema.index({ status: 1 });

// Export models
const Patient = mongoose.model('Patient', patientSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);
const Billing = mongoose.model('Billing', billingSchema);

module.exports = {
  Patient,
  Appointment,
  Billing
};

