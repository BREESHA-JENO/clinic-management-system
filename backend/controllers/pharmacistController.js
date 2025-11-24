const { Medicine, MedicinePrescriptionItem, MedicineInventory, MedicineBill } = require('../models/pharmacist');
const { MedicinePrescription } = require('../models/doctor');
const { LabTestPrescription } = require('../models/doctor');
const { Appointment, Patient } = require('../models/receptionist');
const { Staff } = require('../models/admin');

// Medicine Management
exports.addMedicine = async (req, res) => {
  try {
    const { name, description, manufacturer, price } = req.body;
    // Generate unique medicine ID
    const medicineId = `MED${Date.now()}`;
    const medicine = new Medicine({
      medicineId,
      name,
      description,
      manufacturer,
      price
    });
    await medicine.save();
    res.status(201).json(medicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndUpdate(
      { medicineId: req.params.medicineId }, 
      req.body, 
      { new: true }
    );
    if (!medicine) return res.status(404).json({ error: 'Medicine not found' });
    res.json(medicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findOne({ medicineId: req.params.medicineId });
    if (!medicine) return res.status(404).json({ error: 'Medicine not found' });
    res.json(medicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deactivateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndUpdate(
      { medicineId: req.params.medicineId }, 
      { isActive: false }, 
      { new: true }
    );
    if (!medicine) return res.status(404).json({ error: 'Medicine not found' });
    res.json(medicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Medicine Inventory Management
exports.addInventoryItem = async (req, res) => {
  try {
    const inventory = new MedicineInventory(req.body);
    await inventory.save();
    res.status(201).json(inventory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateInventoryQuantity = async (req, res) => {
  try {
    const inventory = await MedicineInventory.findByIdAndUpdate(req.params.medicineStockId, req.body, { new: true });
    if (!inventory) return res.status(404).json({ error: 'Inventory item not found' });
    res.json(inventory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getInventoryByMedicineId = async (req, res) => {
  try {
    const inventory = await MedicineInventory.find({ medicineId: req.params.medicineId });
    res.json(inventory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listInventoryItems = async (req, res) => {
  try {
    const inventory = await MedicineInventory.find();
    res.json(inventory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.flagLowStock = async (req, res) => {
  try {
    const inventory = await MedicineInventory.findByIdAndUpdate(req.params.medicineStockId, { isLowStock: true }, { new: true });
    if (!inventory) return res.status(404).json({ error: 'Inventory item not found' });
    res.json(inventory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Medicine Prescription Management
exports.createMedicinePrescription = async (req, res) => {
  try {
    const {
      appointmentId,
      medicineId,
      medicineName,
      dosage,
      duration,
      quantity,
      prescribedBy,
      prescribedDoctorName,
      patientName,
      patientAge
    } = req.body;
    // Generate unique prescription ID
    const prescriptionId = `PRESC${Date.now()}`;
    const prescription = new MedicinePrescriptionItem({
      prescriptionId,
      appointmentId,
      medicineId,
      medicineName,
      dosage,
      duration,
      quantity,
      prescribedBy,
      prescribedDoctorName,
      patientName,
      patientAge
    });
    await prescription.save();
    res.status(201).json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMedicinePrescriptionById = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    const prescription = await MedicinePrescriptionItem.findOne({ prescriptionId });
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
    res.json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPatientPrescriptions = async (req, res) => {
  try {
    const { patientName } = req.params;
    const prescriptions = await MedicinePrescriptionItem.find({ patientName });
    res.json(prescriptions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Medicine Bill Management
exports.createMedicineBill = async (req, res) => {
  try {
    const {
      prescriptionId,
      patientName,
      patientAge,
      prescribedDoctorName,
      medicines,
      issuedBy,
      paymentMethod
    } = req.body;
    // Generate unique bill ID
    const billId = `BILL${Date.now()}`;
    // Calculate totals
    const subtotal = medicines.reduce((sum, med) => sum + med.totalPrice, 0);
    const tax = subtotal * 0.05; // 5% tax
    const totalAmount = subtotal + tax;
    const bill = new MedicineBill({
      billId,
      prescriptionId,
      patientName,
      patientAge,
      prescribedDoctorName,
      medicines,
      subtotal,
      tax,
      totalAmount,
      issuedBy,
      paymentMethod
    });
    await bill.save();
    res.status(201).json(bill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMedicineBillById = async (req, res) => {
  try {
    const { billId } = req.params;
    const bill = await MedicineBill.findOne({ billId });
    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json(bill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateBillPaymentStatus = async (req, res) => {
  try {
    const { billId } = req.params;
    const { isPaid, paymentMethod } = req.body;
    const bill = await MedicineBill.findOneAndUpdate(
      { billId },
      { isPaid, paymentMethod },
      { new: true }
    );
    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json(bill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Integration functions for Doctor module
exports.getMedicineById = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const medicine = await Medicine.findOne({ medicineId });
    if (!medicine) return res.status(404).json({ error: 'Medicine not found' });
    res.json(medicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMedicinesBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;
    // This would filter medicines based on specialization
    const medicines = await Medicine.find({ isActive: true });
    res.json(medicines);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSpecializationByName = async (req, res) => {
  try {
    const { specializationName } = req.params;
    
    // Import the Specialization model from admin
    const { Specialization } = require('../models/admin');
    
    const specialization = await Specialization.findOne({ 
      name: { $regex: new RegExp(specializationName, 'i') },
      isActive: true 
    });
    
    if (!specialization) {
      return res.status(404).json({ 
        error: `Specialization '${specializationName}' not found` 
      });
    }
    
    res.json(specialization);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllSpecializations = async (req, res) => {
  try {
    // Import the Specialization model from admin
    const { Specialization } = require('../models/admin');
    
    const specializations = await Specialization.find({ isActive: true })
      .select('specializationId name description')
      .sort({ name: 1 });
    
    res.json(specializations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.processDoctorPrescription = async (req, res) => {
  try {
    const { prescriptionId, medicines, patientId, doctorId } = req.body;
    
    // Validate prescription exists using MedicinePrescription model
    const { MedicinePrescription } = require('../models/doctor');
    const prescription = await MedicinePrescription.findOne({ medicinePrescriptionId: prescriptionId });
    
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    
    // Check medicine availability
    const unavailableMedicines = [];
    for (let medicine of medicines) {
      const medicineStock = await MedicineInventory.findOne({ 
        medicineId: medicine.medicineId,
        quantity: { $gte: medicine.quantity }
      });
      if (!medicineStock) {
        unavailableMedicines.push(medicine.medicineName);
      }
    }
    
    if (unavailableMedicines.length > 0) {
      return res.status(400).json({ 
        error: 'Some medicines are not available in sufficient quantity',
        unavailableMedicines 
      });
    }
    
    // Update inventory
    for (let medicine of medicines) {
      await MedicineInventory.findOneAndUpdate(
        { medicineId: medicine.medicineId },
        { $inc: { quantity: -medicine.quantity } }
      );
    }
    
    res.json({ 
      message: 'Prescription processed successfully',
      prescriptionId,
      processedMedicines: medicines
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMedicineInventoryStatus = async (req, res) => {
  try {
    const inventory = await MedicineInventory.find({ isActive: true });
    res.json(inventory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ==================== CROSS-MODULE INTEGRATION ====================

// Fetch prescriptions from Doctor module
exports.getDoctorPrescriptions = async (req, res) => {
  try {
    const { patientId, appointmentId, doctorId } = req.query;
    let query = {};

    // Since receptionist models use string IDs and doctor models use ObjectIds,
    // we need to handle this mismatch. For now, we'll return all prescriptions
    // and let the frontend filter if needed.
    
    const prescriptions = await MedicinePrescription.find()
      .sort({ date: -1 });

    // Convert to string IDs for response and add patient/doctor info
    const responseData = await Promise.all(prescriptions.map(async (prescription) => {
      // Get patient info
      const patient = await Patient.findOne({ patientId: prescription.patientId });
      // Get doctor info
      const doctor = await Staff.findOne({ staffId: prescription.doctorId });
      // Get appointment info
      const appointment = await Appointment.findOne({ appointmentId: prescription.appointmentId });

      return {
        _id: prescription._id,
        medicinePrescriptionId: prescription.medicinePrescriptionId,
        appointmentId: appointment?.appointmentId || prescription.appointmentId,
        patientId: patient?.patientId || prescription.patientId,
        patientName: patient?.name || 'Unknown Patient',
        doctorId: doctor?.staffId || prescription.doctorId,
        doctorName: doctor?.name || 'Unknown Doctor',
        medicines: prescription.medicines,
        date: prescription.date
      };
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

// Fetch lab test prescriptions from Doctor module
exports.getLabTestPrescriptions = async (req, res) => {
  try {
    const { patientId, appointmentId, doctorId } = req.query;
    
    // Since receptionist models use string IDs and doctor models use ObjectIds,
    // we need to handle this mismatch. For now, we'll return all lab test prescriptions
    // and let the frontend filter if needed.
    
    const labTests = await LabTestPrescription.find()
      .sort({ date: -1 });

    // Convert to string IDs for response and add patient/doctor info
    const responseData = await Promise.all(labTests.map(async (test) => {
      // Get patient info
      const patient = await Patient.findOne({ patientId: test.patientId });
      // Get doctor info
      const doctor = await Staff.findOne({ staffId: test.doctorId });
      // Get appointment info
      const appointment = await Appointment.findOne({ appointmentId: test.appointmentId });

      return {
        _id: test._id,
        labTestPrescriptionId: test.labTestPrescriptionId,
        appointmentId: appointment?.appointmentId || test.appointmentId,
        patientId: patient?.patientId || test.patientId,
        patientName: patient?.name || 'Unknown Patient',
        doctorId: doctor?.staffId || test.doctorId,
        doctorName: doctor?.name || 'Unknown Doctor',
        tests: test.tests,
        date: test.date
      };
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
