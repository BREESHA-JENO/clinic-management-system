require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
        console.log('Admin already exists');
        process.exit();
    }
    const admin = new User({ username: 'admin1', password: 'Admin@123', role: 'admin' });
    await admin.save();
    console.log('✅ Admin created');
    process.exit();
});
