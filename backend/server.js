require('dotenv').config();
const cors=require('cors');
const connectDB=require('./config/db');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const adminRouter = require('./routers/adminRouter');
const receptionistRouter = require('./routers/receptionistRouter');
const doctorRouter = require('./routers/doctorRouter');
const labtechnicianRouter = require('./routers/labtechnicianRouter');
const pharmacistRouter = require('./routers/pharmacistRouter');

const app=express();

//middleware -->act between req and res
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/admin', adminRouter);
app.use('/api/receptionist', receptionistRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/labtechnician', labtechnicianRouter);
app.use('/api/pharmacist', pharmacistRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Clinic Management System API');
});

// 🔹 MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // The User model is removed, so this part of the code will cause an error.
        // Assuming the intent was to remove the User model import and any code that uses it.
        // For now, we'll keep the structure but acknowledge the missing User model.
        // If the User model is intended to be re-added, this section needs to be updated.
        // For now, we'll just return an error as the User model is not available.
        res.status(500).json({ message: 'User model not available for login.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// 🔹 Register new admin (optional)
app.post('/api/admin/register', async (req, res) => {
    try {
        // The User model is removed, so this part of the code will cause an error.
        // Assuming the intent was to remove the User model import and any code that uses it.
        // For now, we'll keep the structure but acknowledge the missing User model.
        // If the User model is intended to be re-added, this section needs to be updated.
        // For now, we'll just return an error as the User model is not available.
        res.status(500).json({ message: 'User model not available for registration.' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
