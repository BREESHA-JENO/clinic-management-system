require('dotenv').config();
const mongoose = require('mongoose');
const { Consultation } = require('./models/doctor');
const { Appointment, Patient } = require('./models/receptionist');
const { Staff } = require('./models/admin');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        console.log('🧪 Testing consultation creation...');

        // Test data
        const testData = {
            appointmentId: 'APT2024010001',
            patientId: 'P20240001',
            doctorId: 'doc001',
            symptoms: 'Fever and cough',
            diagnosis: 'Common cold',
            notes: 'Patient should rest and take prescribed medication'
        };

        // Check if required data exists
        const appointment = await Appointment.findOne({ appointmentId: testData.appointmentId });
        const patient = await Patient.findOne({ patientId: testData.patientId });
        const doctor = await Staff.findOne({ staffId: testData.doctorId });

        console.log('📋 Test Data Status:');
        console.log(`Appointment: ${appointment ? '✅ Found' : '❌ Not found'}`);
        console.log(`Patient: ${patient ? '✅ Found' : '❌ Not found'}`);
        console.log(`Doctor: ${doctor ? '✅ Found' : '❌ Not found'}`);

        if (!appointment || !patient || !doctor) {
            console.log('\n⚠️  Some required data is missing. Creating test data...');
            
            // Create test appointment if not exists
            if (!appointment) {
                const newAppointment = new Appointment({
                    appointmentId: testData.appointmentId,
                    patientId: testData.patientId,
                    doctorId: testData.doctorId,
                    date: new Date(),
                    status: 'confirmed'
                });
                await newAppointment.save();
                console.log('✅ Created test appointment');
            }

            // Create test patient if not exists
            if (!patient) {
                const newPatient = new Patient({
                    patientId: testData.patientId,
                    name: 'Test Patient',
                    dob: new Date('1990-01-01'),
                    gender: 'male',
                    bloodGroup: 'O+'
                });
                await newPatient.save();
                console.log('✅ Created test patient');
            }

            // Create test doctor if not exists
            if (!doctor) {
                const newDoctor = new Staff({
                    staffId: testData.doctorId,
                    name: 'Test Doctor',
                    email: 'doctor@test.com',
                    phone: '9876543210',
                    dob: new Date('1980-01-01'),
                    role: 'doctor'
                });
                await newDoctor.save();
                console.log('✅ Created test doctor');
            }
        }

        // Test consultation creation
        console.log('\n🔧 Testing consultation creation...');
        const consultation = await Consultation.create({
            appointmentId: testData.appointmentId,
            patientId: testData.patientId,
            doctorId: testData.doctorId,
            symptoms: testData.symptoms,
            diagnosis: testData.diagnosis,
            notes: testData.notes
        });

        console.log('✅ Consultation created successfully!');
        console.log('📄 Consultation Details:');
        console.log(`ID: ${consultation._id}`);
        console.log(`Consultation ID: ${consultation.consultationId}`);
        console.log(`Appointment ID: ${consultation.appointmentId}`);
        console.log(`Patient ID: ${consultation.patientId}`);
        console.log(`Doctor ID: ${consultation.doctorId}`);
        console.log(`Symptoms: ${consultation.symptoms}`);
        console.log(`Diagnosis: ${consultation.diagnosis}`);
        console.log(`Notes: ${consultation.notes}`);
        console.log(`Date: ${consultation.date}`);

        // Clean up test data
        await Consultation.findByIdAndDelete(consultation._id);
        console.log('\n🧹 Cleaned up test consultation');

        console.log('\n🎉 Test completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}); 