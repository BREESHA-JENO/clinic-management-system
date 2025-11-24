const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    name: { type: String, trim: true },
    role: { type: String, enum: ['admin', 'receptionist', 'doctor', 'labtech', 'pharmacist'], required: true },
    isActive: { type: Boolean, default: true },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Check if account is locked
userSchema.methods.isLocked = function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
userSchema.methods.incLoginAttempts = async function() {
    try {
        // If we have a previous lock that has expired, restart at 1
        if (this.lockUntil && this.lockUntil < Date.now()) {
            this.lockUntil = null;
            this.loginAttempts = 1;
        } else {
            this.loginAttempts += 1;
        }
        
        // Lock account after 3 failed attempts for 30 seconds
        if (this.loginAttempts >= 3) {
            this.lockUntil = new Date(Date.now() + 30 * 1000); // 30 seconds
        }
        
        await this.save();
        return this;
    } catch (error) {
        console.error('Error incrementing login attempts:', error);
        throw error;
    }
};

// Reset login attempts on successful login
userSchema.methods.resetLoginAttempts = async function() {
    try {
        this.loginAttempts = 0;
        this.lockUntil = null;
        await this.save();
        return this;
    } catch (error) {
        console.error('Error resetting login attempts:', error);
        throw error;
    }
};

module.exports = mongoose.model('User', userSchema);

