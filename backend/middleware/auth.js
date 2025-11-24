const jwt = require('jsonwebtoken');

// JWT Secret (in production, this should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Role definitions
const ROLES = {
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    RECEPTIONIST: 'receptionist',
    LAB_TECHNICIAN: 'labtech',
    PHARMACIST: 'pharmacist'
};

// Role permissions mapping
const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: ['admin', 'doctor', 'receptionist', 'labtech', 'pharmacist'],
    [ROLES.DOCTOR]: ['doctor'],
    [ROLES.RECEPTIONIST]: ['receptionist'],
    [ROLES.LAB_TECHNICIAN]: ['labtech'],
    [ROLES.PHARMACIST]: ['pharmacist']
};

// Generate role-specific JWT token
const generateRoleToken = (userId, role, additionalData = {}) => {
    try {
        // Get current date and set expiration to end of day (23:59:59)
        const now = new Date();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        
        const payload = {
            userId,
            role,
            permissions: ROLE_PERMISSIONS[role] || [],
            ...additionalData,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(endOfDay.getTime() / 1000)
        };
        
        return jwt.sign(payload, JWT_SECRET);
    } catch (error) {
        console.error('Error generating role token:', error);
        throw new Error('Failed to generate role token');
    }
};

// Verify JWT token
const verifyToken = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please login again.'
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

// Role-based authorization middleware
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Authentication required.'
            });
        }
        
        // Check if user's role is in the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required roles: ${allowedRoles.join(', ')}. Your role: ${req.user.role}`
            });
        }
        
        next();
    };
};

// Specific role authorization middlewares
// CURRENT APPROACH: Admin can access all functions (common pattern)
const authorizeAdmin = authorizeRole([ROLES.ADMIN]);
const authorizeDoctor = authorizeRole([ROLES.ADMIN, ROLES.DOCTOR]);
const authorizeReceptionist = authorizeRole([ROLES.ADMIN, ROLES.RECEPTIONIST]);
const authorizeLabTechnician = authorizeRole([ROLES.ADMIN, ROLES.LAB_TECHNICIAN]);
const authorizePharmacist = authorizeRole([ROLES.ADMIN, ROLES.PHARMACIST]);

// ALTERNATIVE RESTRICTED APPROACH: Admin can only access admin functions
// Uncomment the lines below if you want admin to be restricted to admin functions only
// const authorizeAdmin = authorizeRole([ROLES.ADMIN]);
// const authorizeDoctor = authorizeRole([ROLES.DOCTOR]);
// const authorizeReceptionist = authorizeRole([ROLES.RECEPTIONIST]);
// const authorizeLabTechnician = authorizeRole([ROLES.LAB_TECHNICIAN]);
// const authorizePharmacist = authorizeRole([ROLES.PHARMACIST]);

// Permission-based authorization
const authorizePermission = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Authentication required.'
            });
        }
        
        // Admin has all permissions
        if (req.user.role === ROLES.ADMIN) {
            return next();
        }
        
        // Check if user has the required permission
        if (!req.user.permissions || !req.user.permissions.includes(requiredPermission)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required permission: ${requiredPermission}`
            });
        }
        
        next();
    };
};

// Optional authentication (doesn't fail if no token provided)
const optionalAuth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        }
        
        next();
    } catch (error) {
        // Continue without authentication if token is invalid
        next();
    }
};

// Legacy function for backward compatibility
const generateToken = (userId, role) => {
    return generateRoleToken(userId, role);
};

module.exports = {
    // Enhanced functions
    generateRoleToken,
    generateToken,
    verifyToken,
    optionalAuth,
    authorizeRole,
    authorizePermission,
    
    // Specific role authorizations
    authorizeAdmin,
    authorizeDoctor,
    authorizeReceptionist,
    authorizeLabTechnician,
    authorizePharmacist,
    
    // Constants
    ROLES,
    ROLE_PERMISSIONS,
    JWT_SECRET
};
