const { generateToken } = require('../middleware/auth');
const { Doctor } = require('../models/receptionist');

// Simple login for doctors (you can extend this for other roles)
const login = async (req, res) => {
  try {
    const { doctorId, password } = req.body;

    // For demo purposes, we'll use a simple password check
    // In production, you should hash passwords and store them securely
    const doctor = await Doctor.findOne({ doctorId });
    
    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // For demo: password is "password123" for all doctors
    // In production, use bcrypt to compare hashed passwords
    if (password !== 'password123') {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token that expires at end of day
    const token = generateToken(doctor.doctorId, 'doctor');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: doctor.doctorId,
          name: doctor.name,
          role: 'doctor',
          specialization: doctor.specialization
        }
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// Get current user info
const getCurrentUser = async (req, res) => {
  try {
    const { userId, role } = req.user;

    if (role === 'doctor') {
      const doctor = await Doctor.findOne({ doctorId: userId });
      
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.json({
        success: true,
        data: {
          id: doctor.doctorId,
          name: doctor.name,
          role: 'doctor',
          specialization: doctor.specialization,
          email: doctor.email
        }
      });
    }

    res.status(400).json({
      success: false,
      message: 'Invalid user role'
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting current user',
      error: error.message
    });
  }
};

// Logout (client-side token removal)
const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: error.message
    });
  }
};

module.exports = {
  login,
  getCurrentUser,
  logout
}; 