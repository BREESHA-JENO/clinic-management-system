<<<<<<< HEAD
const { Medicine, MedicinePrescription, MedicineInventory, MedicineBill } = require('../models/pharmacist');
=======
const { Medicine, MedicinePrescriptionItem, MedicineInventory, MedicineBill } = require('../models/pharmacist');
>>>>>>> d890af73c091528a847f4dd611078c653778c3e1

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
    const medicine = await Medicine.findByIdAndUpdate(req.params.medicineId, req.body, { new: true });
    if (!medicine) return res.status(404).json({ error: 'Medicine not found' });
    res.json(medicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.medicineId);
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
    const medicine = await Medicine.findByIdAndUpdate(req.params.medicineId, { isActive: false }, { new: true });
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

<<<<<<< HEAD
    const prescription = new MedicinePrescription({
=======
    const prescription = new MedicinePrescriptionItem({
>>>>>>> d890af73c091528a847f4dd611078c653778c3e1
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
<<<<<<< HEAD
    const prescription = await MedicinePrescription.findOne({ prescriptionId });
=======
    const prescription = await MedicinePrescriptionItem.findOne({ prescriptionId });
>>>>>>> d890af73c091528a847f4dd611078c653778c3e1
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
    res.json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPatientPrescriptions = async (req, res) => {
  try {
    const { patientName } = req.params;
<<<<<<< HEAD
    const prescriptions = await MedicinePrescription.find({ patientName });
=======
    const prescriptions = await MedicinePrescriptionItem.find({ patientName });
>>>>>>> d890af73c091528a847f4dd611078c653778c3e1
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

exports.processDoctorPrescription = async (req, res) => {
  try {
    const { prescriptionId, medicines, patientId, doctorId } = req.body;
    
    // Validate prescription exists
    const prescription = await require('../models/doctor').Prescription.findOne({ prescriptionId });
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
