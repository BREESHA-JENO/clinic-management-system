require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const { Role, Specialization } = require('./models/admin');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Create roles
        const roles = [
            { name: 'Admin', description: 'System administrator' },
            { name: 'Doctor', description: 'Medical doctor' },
            { name: 'Receptionist', description: 'Front desk staff' },
            { name: 'Lab Technician', description: 'Laboratory technician' },
            { name: 'Pharmacist', description: 'Pharmacy staff' }
        ];

        for (const roleData of roles) {
            const existingRole = await Role.findOne({ name: roleData.name });
            if (!existingRole) {
                const role = new Role(roleData);
                await role.save();
                console.log(`✅ Role '${roleData.name}' created`);
            } else {
                console.log(`ℹ️  Role '${roleData.name}' already exists`);
            }
        }

        // Create specializations
        const specializations = [
            { name: 'Cardiology', description: 'Heart and cardiovascular system' },
            { name: 'Dermatology', description: 'Skin, hair, and nails' },
            { name: 'Neurology', description: 'Nervous system and brain' },
            { name: 'Orthopedics', description: 'Bones, joints, and muscles' },
            { name: 'Pediatrics', description: 'Children and adolescents' },
            { name: 'Psychiatry', description: 'Mental health and behavior' },
            { name: 'General Medicine', description: 'General medical practice' },
            { name: 'Emergency Medicine', description: 'Emergency and urgent care' },
            { name: 'Oncology', description: 'Cancer treatment' },
            { name: 'Radiology', description: 'Medical imaging and diagnosis' }
        ];

        for (const specData of specializations) {
            const existingSpec = await Specialization.findOne({ name: specData.name });
            if (!existingSpec) {
                const specialization = new Specialization(specData);
                await specialization.save();
                console.log(`✅ Specialization '${specData.name}' created`);
            } else {
                console.log(`ℹ️  Specialization '${specData.name}' already exists`);
            }
        }

        // Create users for all roles
        const users = [
            { username: 'admin1', password: 'Admin@123', role: 'admin', name: 'System Administrator' },
            { username: 'receptionist1', password: 'Receptionist@123', role: 'receptionist', name: 'Front Desk Staff' },
            { username: 'doctor1', password: 'Doctor@123', role: 'doctor', name: 'Medical Doctor' },
            { username: 'labtech1', password: 'Labtech@123', role: 'labtech', name: 'Lab Technician' },
            { username: 'pharmacist1', password: 'Pharmacist@123', role: 'pharmacist', name: 'Pharmacy Staff' }
        ];

        for (const userData of users) {
            const existingUser = await User.findOne({ username: userData.username });
            if (!existingUser) {
                const user = new User(userData);
                await user.save();
                console.log(`✅ ${userData.role} user '${userData.username}' created`);
            } else {
                console.log(`ℹ️  ${userData.role} user '${userData.username}' already exists`);
            }
        }

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('Admin: admin1 / Admin@123');
        console.log('Receptionist: receptionist1 / Receptionist@123');
        console.log('Doctor: doctor1 / Doctor@123');
        console.log('Lab Tech: labtech1 / Labtech@123');
        console.log('Pharmacist: pharmacist1 / Pharmacist@123');
        console.log('\n🔗 Login Endpoints:');
        console.log('POST /api/auth/admin/login');
        console.log('POST /api/auth/receptionist/login');
        console.log('POST /api/auth/doctor/login');
        console.log('POST /api/auth/labtech/login');
        console.log('POST /api/auth/pharmacist/login');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    }
});
