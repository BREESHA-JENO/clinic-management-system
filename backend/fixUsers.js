require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        console.log('🔧 Fixing user passwords...');

        // Delete existing users
        await User.deleteMany({});
        console.log('✅ Deleted existing users');

        // Create users with correct passwords
        const users = [
            { username: 'admin1', password: 'Admin@123', role: 'admin', name: 'System Administrator' },
            { username: 'receptionist1', password: 'Receptionist@123', role: 'receptionist', name: 'Front Desk Staff' },
            { username: 'doctor1', password: 'Doctor@123', role: 'doctor', name: 'Medical Doctor' },
            { username: 'labtech1', password: 'Labtech@123', role: 'labtech', name: 'Lab Technician' },
            { username: 'pharmacist1', password: 'Pharmacist@123', role: 'pharmacist', name: 'Pharmacy Staff' }
        ];

        for (const userData of users) {
            const user = new User(userData);
            await user.save();
            console.log(`✅ ${userData.role} user '${userData.username}' created`);
        }

        console.log('🎉 User passwords fixed successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('Admin: admin1 / Admin@123');
        console.log('Receptionist: receptionist1 / Receptionist@123');
        console.log('Doctor: doctor1 / Doctor@123');
        console.log('Lab Tech: labtech1 / Labtech@123');
        console.log('Pharmacist: pharmacist1 / Pharmacist@123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing users:', error);
        process.exit(1);
    }
}); 