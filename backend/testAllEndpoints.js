require('dotenv').config();
const mongoose = require('mongoose');

// Test data from the insertion script
const TEST_DATA = {
    users: {
        admin: { username: 'testadmin1', password: 'TestAdmin@123' },
        doctor: { username: 'testdoctor1', password: 'TestDoctor@123' },
        receptionist: { username: 'testreceptionist1', password: 'TestReceptionist@123' },
        labtech: { username: 'testlabtech1', password: 'TestLabtech@123' },
        pharmacist: { username: 'testpharmacist1', password: 'TestPharmacist@123' }
    },
    ids: {
        patientId: 'TESTP001',
        appointmentId: 'TESTAPT001',
        consultationId: 'CONS007',
        medicinePrescriptionId: 'MEDP003',
        labTestPrescriptionId: 'LTP002'
    }
};

console.log('🧪 Testing all API endpoints with inserted data...\n');

// Test authentication endpoints
async function testAuthentication() {
    console.log('🔐 Testing Authentication Endpoints...');
    
    const roles = ['admin', 'doctor', 'receptionist', 'labtech', 'pharmacist'];
    
    for (const role of roles) {
        const user = TEST_DATA.users[role];
        console.log(`\n📋 Testing ${role} login...`);
        if (role === 'labtech') {
            console.log(`   Endpoint: POST /api/auth/${role}/login or POST /api/auth/labtechnician/login`);
        } else {
            console.log(`   Endpoint: POST /api/auth/${role}/login`);
        }
        console.log(`   Username: ${user.username}`);
        console.log(`   Password: ${user.password}`);
        console.log(`   Expected: Success with role-specific token`);
    }
    
    console.log('\n✅ Authentication endpoints ready for testing');
}

// Test admin endpoints
async function testAdminEndpoints() {
    console.log('\n👨‍💼 Testing Admin Endpoints...');
    
    const adminEndpoints = [
        'POST /api/admin/create-user',
        'POST /api/admin/roles',
        'GET /api/admin/roles',
        'GET /api/admin/roles/:roleId',
        'PUT /api/admin/roles/:roleId',
        'PATCH /api/admin/roles/:roleId/deactivate',
        'POST /api/admin/staff',
        'GET /api/admin/staff',
        'GET /api/admin/staff/:id',
        'PUT /api/admin/staff/:identifier',
        'PATCH /api/admin/staff/:identifier',
        'POST /api/admin/specializations',
        'GET /api/admin/specializations',
        'GET /api/admin/specializations/:specializationId',
        'PUT /api/admin/specializations/:specializationId',
        'POST /api/admin/doctors',
        'GET /api/admin/doctors',
        'GET /api/admin/doctors/:doctorId',
        'PUT /api/admin/doctors/:doctorId',
        'PATCH /api/admin/doctors/:doctorId/deactivate'
    ];
    
    adminEndpoints.forEach(endpoint => {
        console.log(`   ${endpoint}`);
    });
    
    console.log('\n✅ Admin endpoints ready for testing');
}

// Test doctor endpoints
async function testDoctorEndpoints() {
    console.log('\n👨‍⚕️ Testing Doctor Endpoints...');
    
    const doctorEndpoints = [
        'POST /api/doctor/consultations',
        'PUT /api/doctor/consultations/:id',
        'GET /api/doctor/consultations/appointment/:appointmentId',
        'GET /api/doctor/consultations/doctor/:doctorId',
        'POST /api/doctor/prescriptions/medicine',
        'PUT /api/doctor/prescriptions/medicine/:id',
        'GET /api/doctor/prescriptions/medicine/:prescriptionId',
        'GET /api/doctor/prescriptions/medicine/appointment/:appointmentId',
        'GET /api/doctor/prescriptions/medicine/patient/:patientId',
        'POST /api/doctor/prescriptions/labtest',
        'PUT /api/doctor/prescriptions/labtest/:id',
        'GET /api/doctor/prescriptions/labtest/:prescriptionId',
        'GET /api/doctor/prescriptions/labtest/appointment/:appointmentId',
        'GET /api/doctor/prescriptions/labtest/patient/:patientId',
        'GET /api/doctor/consultations/patient/:patientId',
        'GET /api/doctor/consultations/doctor/:doctorId',
        'GET /api/doctor/consultations/history/appointment/:appointmentId',
        'GET /api/doctor/prescriptions/medicine/history/patient/:patientId',
        'GET /api/doctor/prescriptions/medicine/history/doctor/:doctorId',
        'GET /api/doctor/prescriptions/medicine/history/appointment/:appointmentId'
    ];
    
    doctorEndpoints.forEach(endpoint => {
        console.log(`   ${endpoint}`);
    });
    
    console.log('\n✅ Doctor endpoints ready for testing');
}

// Test receptionist endpoints
async function testReceptionistEndpoints() {
    console.log('\n👩‍💼 Testing Receptionist Endpoints...');
    
    const receptionistEndpoints = [
        'POST /api/receptionist/patients',
        'GET /api/receptionist/patients',
        'GET /api/receptionist/patients/:patientId',
        'PUT /api/receptionist/patients/:patientId',
        'DELETE /api/receptionist/patients/:patientId',
        'POST /api/receptionist/appointments',
        'GET /api/receptionist/appointments',
        'GET /api/receptionist/appointments/:appointmentId',
        'PUT /api/receptionist/appointments/:appointmentId',
        'DELETE /api/receptionist/appointments/:appointmentId',
        'POST /api/receptionist/billing',
        'GET /api/receptionist/billing',
        'GET /api/receptionist/billing/:billingId',
        'PUT /api/receptionist/billing/:billingId',
        'DELETE /api/receptionist/billing/:billingId'
    ];
    
    receptionistEndpoints.forEach(endpoint => {
        console.log(`   ${endpoint}`);
    });
    
    console.log('\n✅ Receptionist endpoints ready for testing');
}

// Test lab technician endpoints
async function testLabTechnicianEndpoints() {
    console.log('\n🔬 Testing Lab Technician Endpoints...');
    
    const labTechnicianEndpoints = [
        'POST /api/labtechnician/tests',
        'GET /api/labtechnician/tests',
        'GET /api/labtechnician/tests/:testId',
        'PUT /api/labtechnician/tests/:testId',
        'DELETE /api/labtechnician/tests/:testId',
        'POST /api/labtechnician/prescription-items',
        'GET /api/labtechnician/prescription-items',
        'GET /api/labtechnician/prescription-items/:itemId',
        'PUT /api/labtechnician/prescription-items/:itemId',
        'DELETE /api/labtechnician/prescription-items/:itemId',
        'POST /api/labtechnician/results',
        'GET /api/labtechnician/results',
        'GET /api/labtechnician/results/:resultId',
        'PUT /api/labtechnician/results/:resultId',
        'DELETE /api/labtechnician/results/:resultId'
    ];
    
    labTechnicianEndpoints.forEach(endpoint => {
        console.log(`   ${endpoint}`);
    });
    
    console.log('\n✅ Lab Technician endpoints ready for testing');
}

// Test pharmacist endpoints
async function testPharmacistEndpoints() {
    console.log('\n💊 Testing Pharmacist Endpoints...');
    
    const pharmacistEndpoints = [
        'POST /api/pharmacist/medicines',
        'GET /api/pharmacist/medicines',
        'GET /api/pharmacist/medicines/:medicineId',
        'PUT /api/pharmacist/medicines/:medicineId',
        'DELETE /api/pharmacist/medicines/:medicineId',
        'POST /api/pharmacist/prescription-items',
        'GET /api/pharmacist/prescription-items',
        'GET /api/pharmacist/prescription-items/:itemId',
        'PUT /api/pharmacist/prescription-items/:itemId',
        'DELETE /api/pharmacist/prescription-items/:itemId',
        'POST /api/pharmacist/inventory',
        'GET /api/pharmacist/inventory',
        'GET /api/pharmacist/inventory/:inventoryId',
        'PUT /api/pharmacist/inventory/:inventoryId',
        'DELETE /api/pharmacist/inventory/:inventoryId',
        'POST /api/pharmacist/bills',
        'GET /api/pharmacist/bills',
        'GET /api/pharmacist/bills/:billId',
        'PUT /api/pharmacist/bills/:billId',
        'DELETE /api/pharmacist/bills/:billId',
        'GET /api/pharmacist/prescriptions/:prescriptionId'
    ];
    
    pharmacistEndpoints.forEach(endpoint => {
        console.log(`   ${endpoint}`);
    });
    
    console.log('\n✅ Pharmacist endpoints ready for testing');
}

// Test auth endpoints
async function testAuthEndpoints() {
    console.log('\n🔑 Testing Auth Endpoints...');
    
    const authEndpoints = [
        'POST /api/auth/admin/login',
        'POST /api/auth/receptionist/login',
        'POST /api/auth/doctor/login',
        'POST /api/auth/labtech/login',
        'POST /api/auth/labtechnician/login',
        'POST /api/auth/pharmacist/login',
        'POST /api/auth/login',
        'GET /api/auth/me',
        'POST /api/auth/logout'
    ];
    
    authEndpoints.forEach(endpoint => {
        console.log(`   ${endpoint}`);
    });
    
    console.log('\n✅ Auth endpoints ready for testing');
}

// Main test function
async function runAllTests() {
    try {
        await testAuthentication();
        await testAdminEndpoints();
        await testDoctorEndpoints();
        await testReceptionistEndpoints();
        await testLabTechnicianEndpoints();
        await testPharmacistEndpoints();
        await testAuthEndpoints();
        
        console.log('\n🎉 ALL ENDPOINTS READY FOR TESTING!');
        console.log('\n📋 TESTING INSTRUCTIONS:');
        console.log('1. Start the server: npm start');
        console.log('2. Use the test credentials provided above');
        console.log('3. Test each endpoint with the appropriate role token');
        console.log('4. Verify that role-specific access control works');
        
        console.log('\n🔗 SAMPLE TEST REQUESTS:');
        console.log('POST /api/auth/doctor/login');
        console.log('Body: { "username": "testdoctor1", "password": "TestDoctor@123" }');
        console.log('');
        console.log('GET /api/doctor/prescriptions/medicine/MEDP003');
        console.log('Headers: { "Authorization": "Bearer <doctor_token>" }');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during endpoint testing:', error.message);
        process.exit(1);
    }
}

// Run the tests
runAllTests(); 