const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routers
const adminRouter = require('./routers/adminRouter');           // OK
const receptionistRouter = require('./routers/receptionistRouter'); // OK
const doctorRouter = require('./routers/doctorRouter');         // OK
const labtechnicianRouter = require('./routers/labtechnicianRouter'); // OK
const pharmacistRouter = require('./routers/pharmacistRouter'); // OK


const PORT = process.env.PORT || 8000;
const app = express();
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const bcrypt=require('bcryptjs');

// Middleware
app.use(cors());
app.use(express.json());

app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        if (!user.isActive) {
          return res.status(403).json({ message: 'Account is deactivated. Contact admin.' });
}


        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '3h' });
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// 🔹 Register new admin (optional)
app.post('/api/admin/register', async (req, res) => {
    try {
        const admin = new User(req.body);
        await admin.save();
        res.status(201).json(admin);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Routes
app.use('/api/admin', adminRouter);
app.use('/api/receptionist', receptionistRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/labtechnician', labtechnicianRouter);
app.use('/api/pharmacist', pharmacistRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Clinic Management System API');
});

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
