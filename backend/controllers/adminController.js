const adminModels = require('../models/admin');
const User = require('../models/user');
const mongoose = require('mongoose');
const { Role, Staff, Specialization, Doctor } = adminModels;


exports.createUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const allowedRoles = ['receptionist', 'doctor', 'labtech', 'pharmacist'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Admin can only create staff.' });
        }

        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ message: 'Username already exists' });

        const user = new User({ username, password, role });
        await user.save();
        res.status(201).json({ message: `${role} created successfully`, user: { username, role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// ✅ ROLE MANAGEMENT
exports.createRole = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllRoles = async (req, res) => {
    const roles = await Role.find();
    res.json(roles);
};

exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.roleId);
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.json(role);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const updated = await Role.findByIdAndUpdate(req.params.roleId, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Role not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deactivateRole = async (req, res) => {
    try {
        const updated = await Role.findByIdAndUpdate(req.params.roleId, { active: false }, { new: true });
        if (!updated) return res.status(404).json({ message: 'Role not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ✅ STAFF MANAGEMENT
exports.createStaff = async (req, res) => {
    try {
        const staff = new Staff(req.body);
        await staff.save();
        res.status(201).json(staff);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllStaff = async (req, res) => {
    const staff = await Staff.find().populate('role');
    res.json(staff);
};

exports.getStaff = async (req, res) => {
  try {
    const identifier = req.params.id; // can be ObjectId or staffId
    let staff;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      // 🔹 If it's a valid ObjectId, search by _id
      staff = await Staff.findById(identifier);
    }

    // 🔹 If not found by _id OR it's not an ObjectId, search by staffId
    if (!staff) {
      staff = await Staff.findOne({ staffId: identifier });
    }

    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const { identifier } = req.params;   // can be _id or staffId
    const updateData = req.body;

    // Check if identifier is a valid ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);

    // Build query condition
    const condition = isObjectId ? { _id: identifier } : { staffId: identifier };

    const updatedStaff = await Staff.findOneAndUpdate(condition, updateData, { new: true });

    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json(updatedStaff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deactivateStaff = async (req, res) => {
  try {
    const { identifier } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);

    const condition = isObjectId ? { _id: identifier } : { staffId: identifier };

    const deactivateStaff = await Staff.findOneAndDelete(condition);

    if (!deactivateStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json({ message: 'Staff deactivated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ✅ SPECIALIZATION MANAGEMENT
exports.createSpecialization = async (req, res) => {
    try {
        const spec = new Specialization(req.body);
        await spec.save();
        res.status(201).json(spec);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllSpecializations = async (req, res) => {
    const specs = await Specialization.find();
    res.json(specs);
};

exports.getSpecializationById = async (req, res) => {
    try {
        const spec = await Specialization.findById(req.params.specializationId);
        if (!spec) return res.status(404).json({ message: 'Specialization not found' });
        res.json(spec);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateSpecialization = async (req, res) => {
    try {
        const updated = await Specialization.findByIdAndUpdate(req.params.specializationId, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Specialization not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ✅ DOCTOR MANAGEMENT
exports.createDoctor = async (req, res) => {
  try {
    const { staffId, specializationId, qualifications, experience, workingDays, workingHours } = req.body;

    // 🔹 Find staff using custom staffId
    const staff = await Staff.findById(req.body.staff);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    // 🔹 Find specialization using custom specializationId
    const specialization = await Specialization.findById(req.body.specialization);
    if (!specialization) return res.status(404).json({ message: 'Specialization not found' });

    // 🔹 Create Doctor referencing ObjectIds
    const doctor = await Doctor.create({
      staff: staff._id,
      specialization: specialization._id,
      qualifications,
      experience,
      workingDays,
      workingHours
    });

    // ✅ Send response only once
    res.status(201).json(doctor);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllDoctors = async (req, res) => {
    const doctors = await Doctor.find().populate('staff specialization');
    res.json(doctors);
};

exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.doctorId).populate('staff specialization');
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        res.json(doctor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateDoctor = async (req, res) => {
    try {
        const updated = await Doctor.findByIdAndUpdate(req.params.doctorId, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Doctor not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deactivateDoctor = async (req, res) => {
    try {
        const updated = await Doctor.findByIdAndUpdate(req.params.doctorId, { active: false }, { new: true });
        if (!updated) return res.status(404).json({ message: 'Doctor not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
