require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const adminRoutes = require('./routers/adminRouter');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const bcrypt=require('bcryptjs');
const app = express();
app.use(express.json());


// 🔹 MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));

// 🔹 Admin Login Endpoint (returns JWT)
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // ✅ Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and Password required' });
        }

        // ✅ Find user in DB
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        // ✅ Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        // ✅ Generate Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        res.json({ token });

    } catch (err) {
        console.error('❌ Login Error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
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

app.get('/', (req, res) => {
    res.send('Welcome to the Clinic Management System API');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
