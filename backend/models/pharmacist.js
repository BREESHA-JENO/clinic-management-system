const mongoose = require('mongoose');

// Medicine Schema
const MedicineSchema = new mongoose.Schema({
  medicineId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  manufacturer: { type: String },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Medicine Prescription Schema
const MedicinePrescriptionSchema = new mongoose.Schema({
  prescriptionId: { type: String, required: true, unique: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Appointment' },
  medicineId: { type: String, required: true }, // Reference to Medicine medicineId
  medicineName: { type: String, required: true },
  dosage: { type: String, required: true }, // e.g., "1 tablet twice daily"
  duration: { type: String, required: true }, // e.g., "7 days"
  quantity: { type: Number, required: true },
  prescribedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  prescribedDoctorName: { type: String, required: true },
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  prescribedDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Medicine Inventory Schema
const MedicineInventorySchema = new mongoose.Schema({
  medicineId: { type: String, required: true }, // Reference to Medicine medicineId
  medicineName: { type: String, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date },
  isLowStock: { type: Boolean, default: false },
}, { timestamps: true });

// Medicine Bill Schema
const MedicineBillSchema = new mongoose.Schema({
  billId: { type: String, required: true, unique: true },
  prescriptionId: { type: String, required: true }, // Reference to MedicinePrescription prescriptionId
  patientName: { type: String, required: true },
  patientAge: { type: Number, required: true },
  prescribedDoctorName: { type: String, required: true },
  medicines: [{
    medicineId: { type: String, required: true },
    medicineName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  billDate: { type: Date, default: Date.now },
  issuedBy: { type: String, required: true }, // Pharmacist name
  isPaid: { type: Boolean, default: false },
  paymentMethod: { type: String, enum: ['cash', 'card', 'insurance'], default: 'cash' },
}, { timestamps: true });

const Medicine = mongoose.model('Medicine', MedicineSchema);
const MedicinePrescription = mongoose.model('MedicinePrescription', MedicinePrescriptionSchema);
const MedicineInventory = mongoose.model('MedicineInventory', MedicineInventorySchema);
const MedicineBill = mongoose.model('MedicineBill', MedicineBillSchema);

module.exports = {
  Medicine,
  MedicinePrescription,
  MedicineInventory,
  MedicineBill,
};
