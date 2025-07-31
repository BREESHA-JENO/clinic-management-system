const mongoose = require('mongoose');

/* =======================================================
   ROLE MODEL
======================================================= */
const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., Doctor, Receptionist, Lab Technician
    description: String,
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const Role = mongoose.model('Role', roleSchema);

function calculateAge(dob) {
    const diff = Date.now() - dob.getTime();
    return new Date(diff).getUTCFullYear() - 1970;
}

const staffSchema = new mongoose.Schema({
    staffId: { type: String, unique: true }, // e.g., rec001, doc001, lab001, ph001
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: v => /@.*\.com$/.test(v),
            message: props => `${props.value} is not a valid email`
        }
    },

    phone: {
        type: String,
        required: true,
        validate: {
            validator: v => /^[6-9]\d{9}$/.test(v),
            message: props => `${props.value} is not a valid 10-digit mobile number`
        }
    },

    address: String,
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },

    dob: { type: Date, required: true },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// ✅ Auto-generate staffId & validate DOB based on role
staffSchema.pre('save', async function (next) {
    try {
        const roleData = await Role.findById(this.role);
        if (!roleData) return next(new Error('Role not found'));

        const age = calculateAge(this.dob);

        if (roleData.name.toLowerCase() === 'doctor' && age <= 25) {
            return next(new Error('Doctor must be older than 25 years.'));
        }
        if (roleData.name.toLowerCase() !== 'doctor' && age <= 18) {
            return next(new Error('Staff must be older than 18 years.'));
        }

        if (!this.staffId) {
            const prefixMap = {
                receptionist: 'rec',
                doctor: 'doc',
                labtechnician: 'lab',
                pharmacist: 'ph'
            };

            const prefix = prefixMap[roleData.name.toLowerCase()] || 'stf';

            const count = await mongoose.model('Staff').countDocuments({
                staffId: { $regex: `^${prefix}` }
            });

            this.staffId = `${prefix}${(count + 1).toString().padStart(3, '0')}`;
        }

        next();
    } catch (err) {
        next(err);
    }
});

const Staff = mongoose.model('Staff', staffSchema);

/* =======================================================
   SPECIALIZATION MODEL (with numeric specializationId)
======================================================= */
const specializationSchema = new mongoose.Schema({
    specializationId: { type: Number, unique: true },
    name: { type: String, required: true, unique: true },
    description: String,
    createdAt: { type: Date, default: Date.now }
});

specializationSchema.pre('save', async function (next) {
    try {
        if (!this.specializationId) {
            const last = await mongoose.model('Specialization').findOne({}).sort({ specializationId: -1 });
            this.specializationId = last ? last.specializationId + 1 : 1001;
        }
        next();
    } catch (err) {
        next(err);
    }
});

const Specialization = mongoose.model('Specialization', specializationSchema);

/* =======================================================
   DOCTOR MODEL (references staff & specialization)
======================================================= */
const doctorSchema = new mongoose.Schema({
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
    specialization: { type: mongoose.Schema.Types.ObjectId, ref: 'Specialization', required: true },

    qualifications: String,
    experience: Number,

    workingDays: {
        type: [String],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },

    workingHours: {
        start: { type: String, required: true }, // e.g., "09:00"
        end: { type: String, required: true }    // e.g., "17:00"
    },

    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Virtual: access doctorId from linked Staff
doctorSchema.virtual('doctorId').get(function () {
    return this.staff?.staffId;
});

const Doctor = mongoose.model('Doctor', doctorSchema);

/* =======================================================
   EXPORT ALL MODELS
======================================================= */
module.exports = { Role, Staff, Specialization, Doctor };
