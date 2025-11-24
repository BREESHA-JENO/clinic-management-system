require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const express = require('express');

const authRouter = require('./routers/authRouter');
const adminRouter = require('./routers/adminRouter');
const receptionistRouter = require('./routers/receptionistRouter');
const doctorRouter = require('./routers/doctorRouter');
const labtechnicianRouter = require('./routers/labtechnicianRouter');
const pharmacistRouter = require('./routers/pharmacistRouter');

const app = express();

// Middleware
app.use(cors());

// Add error handling for JSON parsing
app.use(express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
        try {
            JSON.parse(buf);
        } catch (e) {
            console.error('Invalid JSON received:', e.message);
            console.error('Request URL:', req.url);
            console.error('Request headers:', req.headers);
            throw new Error('Invalid JSON');
        }
    }
}));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Content-Length:', req.headers['content-length']);
    }
    next();
});

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('JSON parsing error:', err.message);
        console.error('Request URL:', req.url);
        console.error('Request headers:', req.headers);
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid JSON format in request body',
            error: err.message 
        });
    }
    next(err);
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/receptionist', receptionistRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/labtechnician', labtechnicianRouter);
app.use('/api/pharmacist', pharmacistRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Clinic Management System API');
});

// Connect to DB and start server
const PORT = process.env.PORT || 8000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});