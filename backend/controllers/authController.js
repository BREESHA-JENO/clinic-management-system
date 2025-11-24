const User = require('../models/user');
const { generateRoleToken, ROLES } = require('../middleware/auth');

// Generic login function for all roles
const login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ 
        success: false,
        message: 'Username, password, and role are required' 
      });
    }

    // Validate role
    const validRoles = Object.values(ROLES);
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid role. Must be one of: admin, receptionist, doctor, labtech, pharmacist' 
      });
    }

    // Find user by username and specific role
    const user = await User.findOne({ username, role });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found` 
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ 
        success: false,
        message: 'Account is deactivated. Contact admin.' 
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      const lockTime = Math.ceil((user.lockUntil - Date.now()) / 1000);
      return res.status(423).json({ 
        success: false,
        message: `Account is temporarily locked. Try again in ${lockTime} seconds.`,
        lockTime: lockTime
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incLoginAttempts();
      const remainingAttempts = 3 - user.loginAttempts;
      
      if (remainingAttempts <= 0) {
        return res.status(423).json({ 
          success: false,
          message: 'Account locked for 30 seconds due to multiple failed attempts.',
          lockTime: 30
        });
      }
      
      return res.status(401).json({ 
        success: false,
        message: `Invalid credentials. ${remainingAttempts} attempts remaining.`,
        remainingAttempts: remainingAttempts
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Generate role-specific token
    const token = generateRoleToken(user._id, role, {
      username: user.username,
      name: user.name || `${role.charAt(0).toUpperCase() + role.slice(1)}`
    });

    res.status(200).json({ 
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful`,
      token,
      user: {
        id: user._id,
        username: user.username,
        role: role,
        name: user.name || `${role.charAt(0).toUpperCase() + role.slice(1)}`
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: err.message 
    });
  }
};

// Role-specific login functions
const adminLogin = async (req, res) => {
  req.body.role = ROLES.ADMIN;
  return login(req, res);
};

const receptionistLogin = async (req, res) => {
  req.body.role = ROLES.RECEPTIONIST;
  return login(req, res);
};

const doctorLogin = async (req, res) => {
  req.body.role = ROLES.DOCTOR;
  return login(req, res);
};

const labtechLogin = async (req, res) => {
  req.body.role = ROLES.LAB_TECHNICIAN;
  return login(req, res);
};

const pharmacistLogin = async (req, res) => {
  req.body.role = ROLES.PHARMACIST;
  return login(req, res);
};

// Get current user info
const getCurrentUser = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name || `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`
      }
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
  adminLogin,
  receptionistLogin,
  doctorLogin,
  labtechLogin,
  pharmacistLogin,
  getCurrentUser,
  logout
}; 