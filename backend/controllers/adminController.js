const adminModels = require('../models/admin');
const { Role, Staff, Specialization, Doctor } = adminModels;

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

exports.getStaffById = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.staffId).populate('role');
        if (!staff) return res.status(404).json({ message: 'Staff not found' });
        res.json(staff);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateStaff = async (req, res) => {
    try {
        const updated = await Staff.findByIdAndUpdate(req.params.staffId, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Staff not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deactivateStaff = async (req, res) => {
    try {
        const updated = await Staff.findByIdAndUpdate(req.params.staffId, { active: false }, { new: true });
        if (!updated) return res.status(404).json({ message: 'Staff not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
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

    // 🔹 Find staff using staffId (doc001)
    const staff = await Staff.findOne({ staffId: staffId });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    // 🔹 Find specialization using specializationId (1001)
    const specialization = await Specialization.findOne({ specializationId: specializationId });
    if (!specialization) return res.status(404).json({ message: 'Specialization not found' });

    // 🔹 Create Doctor using ObjectIds
    const doctor = await Doctor.create({
      staff: staff._id,
      specialization: specialization._id,
      qualifications,
      experience,
      workingDays,
      workingHours
    });

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
