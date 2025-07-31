require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const adminRoutes = require('./routers/adminRouter');
//const receptionistRoutes = require('./routers/receptionist');
//const doctorRoutes = require('./routers/doctor');
//const labtechRoutes = require('./routers/labtech');
//const pharmacistRoutes = require('./routers/pharmacist');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const bcrypt=require('bcryptjs');
const app = express();
app.use(express.json());

//Routes
app.use('/api/admin',adminRouter);
app.use('/api/receptionist',receptionistRouter);
app.use('/api/doctor',doctorRouter);
app.use('/api/labtechnician', labtechnicianRouter);
app.use('api/pharmacist',pharmacistRouter)

// 🔹 MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
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

// 🔹 Admin Routes
app.use('/api', adminRoutes);
//app.use('/api/receptionist', receptionistRoutes);
//app.use('/api/doctor', doctorRoutes);
//app.use('/api/labtech', labtechRoutes);
//app.use('/api/pharmacist', pharmacistRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Clinic Management System API');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
