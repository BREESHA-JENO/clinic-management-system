require('dotenv').config();
const mongoose = require('mongoose');
const { MedicinePrescription, LabTestPrescription } = require('./models/doctor');
const { Appointment, Patient } = require('./models/receptionist');
const { Staff } = require('./models/admin');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        console.log('🧪 Testing prescription routes...');

        // Test data
        const testData = {
            appointmentId: 'APT2024010001',
            patientId: 'P20240001',
            doctorId: 'doc001',
            medicines: [
                {
                    name: 'Paracetamol',
                    dosage: '500mg',
                    frequency: 'twice daily',
                    duration: '5 days'
                }
            ],
            tests: [
                { name: 'Blood Test' },
                { name: 'Urine Test' }
            ]
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

        // Test medicine prescription creation
        console.log('\n🔧 Testing medicine prescription creation...');
        const medicinePrescription = await MedicinePrescription.create({
            appointmentId: testData.appointmentId,
            patientId: testData.patientId,
            doctorId: testData.doctorId,
            medicines: testData.medicines
        });

        console.log('✅ Medicine prescription created successfully!');
        console.log(`📄 Medicine Prescription ID: ${medicinePrescription.medicinePrescriptionId}`);

        // Test lab test prescription creation
        console.log('\n🔧 Testing lab test prescription creation...');
        const labTestPrescription = await LabTestPrescription.create({
            appointmentId: testData.appointmentId,
            patientId: testData.patientId,
            doctorId: testData.doctorId,
            tests: testData.tests
        });

        console.log('✅ Lab test prescription created successfully!');
        console.log(`📄 Lab Test Prescription ID: ${labTestPrescription.labTestPrescriptionId}`);

        // Test retrieving by ID
        console.log('\n🔍 Testing retrieval by ID...');
        const retrievedMedicine = await MedicinePrescription.findOne({ 
            medicinePrescriptionId: medicinePrescription.medicinePrescriptionId 
        });
        console.log(`✅ Retrieved medicine prescription: ${retrievedMedicine ? 'Success' : 'Failed'}`);

        const retrievedLabTest = await LabTestPrescription.findOne({ 
            labTestPrescriptionId: labTestPrescription.labTestPrescriptionId 
        });
        console.log(`✅ Retrieved lab test prescription: ${retrievedLabTest ? 'Success' : 'Failed'}`);

        // Clean up test data
        await MedicinePrescription.findByIdAndDelete(medicinePrescription._id);
        await LabTestPrescription.findByIdAndDelete(labTestPrescription._id);
        console.log('\n🧹 Cleaned up test prescriptions');

        console.log('\n🎉 Test completed successfully!');
        console.log('\n📋 Available Routes:');
        console.log('GET /api/doctor/prescriptions/medicine/:prescriptionId');
        console.log('GET /api/doctor/prescriptions/labtest/:prescriptionId');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}); 