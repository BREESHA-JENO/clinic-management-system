require('dotenv').config();
const mongoose = require('mongoose');

// Import all models
const User = require('./models/user');
const { Role, Staff, Specialization, Doctor } = require('./models/admin');
const { Consultation, MedicinePrescription, LabTestPrescription } = require('./models/doctor');
const { Patient, Appointment, Billing } = require('./models/receptionist');
const { LabTest, LabTestPrescriptionItem, LabTestResult } = require('./models/labtechnician');
const { Medicine, MedicinePrescriptionItem, MedicineInventory, MedicineBill } = require('./models/pharmacist');
const Counter = require('./models/counter');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        console.log('🚀 Starting comprehensive data insertion test...\n');

        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log('🧹 Clearing existing test data...');
        await User.deleteMany({ username: { $regex: /^test/ } });
        await Role.deleteMany({ name: { $regex: /^Test/ } });
        await Staff.deleteMany({ staffId: { $regex: /^test/ } });
        await Specialization.deleteMany({ name: { $regex: /^Test/ } });
        await Doctor.deleteMany({});
        await Patient.deleteMany({ patientId: { $regex: /^TEST/ } });
        await Appointment.deleteMany({ appointmentId: { $regex: /^TEST/ } });
        await Billing.deleteMany({ billingId: { $regex: /^TEST/ } });
        await Consultation.deleteMany({ consultationId: { $regex: /^TEST/ } });
        await MedicinePrescription.deleteMany({ medicinePrescriptionId: { $regex: /^TEST/ } });
        await LabTestPrescription.deleteMany({ labTestPrescriptionId: { $regex: /^TEST/ } });
        await LabTest.deleteMany({ testId: { $regex: /^TEST/ } });
        await LabTestPrescriptionItem.deleteMany({});
        await LabTestResult.deleteMany({ resultId: { $regex: /^TEST/ } });
        await Medicine.deleteMany({ medicineId: { $regex: /^TEST/ } });
        await MedicinePrescriptionItem.deleteMany({});
        await MedicineInventory.deleteMany({});
        await MedicineBill.deleteMany({ billId: { $regex: /^TEST/ } });
        await Counter.deleteMany({ name: { $regex: /^test/ } });
        console.log('✅ Existing test data cleared\n');

        // 1. Create Roles
        console.log('📋 Creating roles...');
        const roles = [
            { name: 'Test Admin', description: 'Test administrator role' },
            { name: 'Test Doctor', description: 'Test doctor role' },
            { name: 'Test Receptionist', description: 'Test receptionist role' },
            { name: 'Test Lab Technician', description: 'Test lab technician role' },
            { name: 'Test Pharmacist', description: 'Test pharmacist role' }
        ];

        const createdRoles = [];
        for (const roleData of roles) {
            const role = new Role(roleData);
            await role.save();
            createdRoles.push(role);
            console.log(`✅ Created role: ${role.name}`);
        }

        // 2. Create Specializations
        console.log('\n📋 Creating specializations...');
        const specializations = [
            { name: 'Test Cardiology', description: 'Test heart specialization' },
            { name: 'Test Dermatology', description: 'Test skin specialization' },
            { name: 'Test Neurology', description: 'Test brain specialization' }
        ];

        const createdSpecializations = [];
        for (const specData of specializations) {
            const specialization = new Specialization(specData);
            await specialization.save();
            createdSpecializations.push(specialization);
            console.log(`✅ Created specialization: ${specialization.name}`);
        }

        // 3. Create Staff
        console.log('\n📋 Creating staff...');
        const staffData = [
            {
                staffId: 'testdoc001',
                name: 'Test Doctor 1',
                email: 'testdoctor1@test.com',
                phone: '9876543210',
                address: 'Test Address 1',
                role: createdRoles[1]._id, // Test Doctor role
                dob: new Date('1980-01-01')
            },
            {
                staffId: 'testrec001',
                name: 'Test Receptionist 1',
                email: 'testreceptionist1@test.com',
                phone: '9876543211',
                address: 'Test Address 2',
                role: createdRoles[2]._id, // Test Receptionist role
                dob: new Date('1985-01-01')
            },
            {
                staffId: 'testlab001',
                name: 'Test Lab Tech 1',
                email: 'testlabtech1@test.com',
                phone: '9876543212',
                address: 'Test Address 3',
                role: createdRoles[3]._id, // Test Lab Technician role
                dob: new Date('1982-01-01')
            },
            {
                staffId: 'testph001',
                name: 'Test Pharmacist 1',
                email: 'testpharmacist1@test.com',
                phone: '9876543213',
                address: 'Test Address 4',
                role: createdRoles[4]._id, // Test Pharmacist role
                dob: new Date('1983-01-01')
            }
        ];

        const createdStaff = [];
        for (const staffInfo of staffData) {
            const staff = new Staff(staffInfo);
            await staff.save();
            createdStaff.push(staff);
            console.log(`✅ Created staff: ${staff.name} (${staff.staffId})`);
        }

        // 4. Create Doctors
        console.log('\n📋 Creating doctors...');
        const doctorData = [
            {
                staff: createdStaff[0]._id, // Test Doctor 1
                specialization: createdSpecializations[0]._id, // Test Cardiology
                qualifications: 'MBBS, MD',
                experience: 10,
                workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                workingHours: {
                    start: '09:00',
                    end: '17:00'
                }
            }
        ];

        const createdDoctors = [];
        for (const doctorInfo of doctorData) {
            const doctor = new Doctor(doctorInfo);
            await doctor.save();
            createdDoctors.push(doctor);
            console.log(`✅ Created doctor: ${createdStaff[0].name}`);
        }

        // 5. Create Patients
        console.log('\n📋 Creating patients...');
        const patientData = [
            {
                patientId: 'TESTP001',
                name: 'Test Patient 1',
                dob: new Date('1990-01-01'),
                gender: 'male',
                bloodGroup: 'O+'
            },
            {
                patientId: 'TESTP002',
                name: 'Test Patient 2',
                dob: new Date('1985-05-15'),
                gender: 'female',
                bloodGroup: 'A+'
            }
        ];

        const createdPatients = [];
        for (const patientInfo of patientData) {
            const patient = new Patient(patientInfo);
            await patient.save();
            createdPatients.push(patient);
            console.log(`✅ Created patient: ${patient.name} (${patient.patientId})`);
        }

        // 6. Create Appointments
        console.log('\n📋 Creating appointments...');
        const appointmentData = [
            {
                appointmentId: 'TESTAPT001',
                patientId: createdPatients[0].patientId,
                doctorId: createdStaff[0].staffId,
                date: new Date(),
                status: 'confirmed'
            },
            {
                appointmentId: 'TESTAPT002',
                patientId: createdPatients[1].patientId,
                doctorId: createdStaff[0].staffId,
                date: new Date(Date.now() + 86400000), // Tomorrow
                status: 'scheduled'
            }
        ];

        const createdAppointments = [];
        for (const appointmentInfo of appointmentData) {
            const appointment = new Appointment(appointmentInfo);
            await appointment.save();
            createdAppointments.push(appointment);
            console.log(`✅ Created appointment: ${appointment.appointmentId}`);
        }

        // 7. Create Billing
        console.log('\n📋 Creating billing...');
        const billingData = [
            {
                billingId: 'TESTBILL001',
                appointmentId: createdAppointments[0].appointmentId,
                amount: 1500,
                date: new Date(),
                status: 'paid'
            }
        ];

        const createdBilling = [];
        for (const billingInfo of billingData) {
            const billing = new Billing(billingInfo);
            await billing.save();
            createdBilling.push(billing);
            console.log(`✅ Created billing: ${billing.billingId}`);
        }

        // 8. Create Consultations
        console.log('\n📋 Creating consultations...');
        const consultationData = [
            {
                appointmentId: createdAppointments[0].appointmentId,
                patientId: createdPatients[0].patientId,
                doctorId: createdStaff[0].staffId,
                symptoms: 'Fever and cough',
                diagnosis: 'Common cold',
                notes: 'Patient should rest and take prescribed medication'
            }
        ];

        const createdConsultations = [];
        for (const consultationInfo of consultationData) {
            const consultation = new Consultation(consultationInfo);
            await consultation.save();
            createdConsultations.push(consultation);
            console.log(`✅ Created consultation: ${consultation.consultationId}`);
        }

        // 9. Create Medicine Prescriptions
        console.log('\n📋 Creating medicine prescriptions...');
        const medicinePrescriptionData = [
            {
                appointmentId: createdAppointments[0].appointmentId,
                patientId: createdPatients[0].patientId,
                doctorId: createdStaff[0].staffId,
                medicines: [
                    {
                        name: 'Paracetamol',
                        dosage: '500mg',
                        frequency: 'twice daily',
                        duration: '5 days'
                    },
                    {
                        name: 'Vitamin C',
                        dosage: '1000mg',
                        frequency: 'once daily',
                        duration: '7 days'
                    }
                ]
            }
        ];

        const createdMedicinePrescriptions = [];
        for (const prescriptionInfo of medicinePrescriptionData) {
            const prescription = new MedicinePrescription(prescriptionInfo);
            await prescription.save();
            createdMedicinePrescriptions.push(prescription);
            console.log(`✅ Created medicine prescription: ${prescription.medicinePrescriptionId}`);
        }

        // 10. Create Lab Test Prescriptions
        console.log('\n📋 Creating lab test prescriptions...');
        const labTestPrescriptionData = [
            {
                appointmentId: createdAppointments[0].appointmentId,
                patientId: createdPatients[0].patientId,
                doctorId: createdStaff[0].staffId,
                tests: [
                    { name: 'Blood Test' },
                    { name: 'Urine Test' }
                ]
            }
        ];

        const createdLabTestPrescriptions = [];
        for (const prescriptionInfo of labTestPrescriptionData) {
            const prescription = new LabTestPrescription(prescriptionInfo);
            await prescription.save();
            createdLabTestPrescriptions.push(prescription);
            console.log(`✅ Created lab test prescription: ${prescription.labTestPrescriptionId}`);
        }

        // 11. Create Lab Tests
        console.log('\n📋 Creating lab tests...');
        const labTestData = [
            {
                testId: 'TESTLAB001',
                testName: 'Blood Test',
                description: 'Complete blood count test',
                price: 500,
                isActive: true
            },
            {
                testId: 'TESTLAB002',
                testName: 'Urine Test',
                description: 'Urine analysis test',
                price: 300,
                isActive: true
            }
        ];

        const createdLabTests = [];
        for (const testInfo of labTestData) {
            const test = new LabTest(testInfo);
            await test.save();
            createdLabTests.push(test);
            console.log(`✅ Created lab test: ${test.testName} (${test.testId})`);
        }

        // 12. Create Lab Test Prescription Items
        console.log('\n📋 Creating lab test prescription items...');
        const labTestPrescriptionItemData = [
            {
                appointmentId: createdAppointments[0].appointmentId,
                labTestId: createdLabTests[0].testId,
                prescribedBy: createdStaff[0].staffId,
                prescribedDoctorName: createdStaff[0].name,
                prescribedDate: new Date(),
                isActive: true
            }
        ];

        const createdLabTestPrescriptionItems = [];
        for (const itemInfo of labTestPrescriptionItemData) {
            const item = new LabTestPrescriptionItem(itemInfo);
            await item.save();
            createdLabTestPrescriptionItems.push(item);
            console.log(`✅ Created lab test prescription item`);
        }

        // 13. Create Lab Test Results
        console.log('\n📋 Creating lab test results...');
        const labTestResultData = [
            {
                resultId: 'TESTRESULT001',
                labTestPrescriptionItemId: createdLabTestPrescriptionItems[0]._id.toString(),
                testId: createdLabTests[0].testId,
                result: 'Normal',
                currentValue: 12.5,
                minRange: 11.0,
                maxRange: 16.0,
                unit: 'g/dL',
                price: createdLabTests[0].price,
                patientName: createdPatients[0].name,
                patientAge: 30,
                recordedBy: createdStaff[2].staffId,
                recordedByTechnicianName: createdStaff[2].name,
                recordedAt: new Date(),
                resultDate: new Date(),
                status: 'normal'
            }
        ];

        const createdLabTestResults = [];
        for (const resultInfo of labTestResultData) {
            const result = new LabTestResult(resultInfo);
            await result.save();
            createdLabTestResults.push(result);
            console.log(`✅ Created lab test result: ${result.resultId}`);
        }

        // 14. Create Medicines
        console.log('\n📋 Creating medicines...');
        const medicineData = [
            {
                medicineId: 'TESTMED001',
                name: 'Paracetamol',
                description: 'Pain reliever and fever reducer',
                manufacturer: 'Test Pharma',
                price: 50,
                isActive: true
            },
            {
                medicineId: 'TESTMED002',
                name: 'Vitamin C',
                description: 'Vitamin C supplement',
                manufacturer: 'Test Pharma',
                price: 30,
                isActive: true
            }
        ];

        const createdMedicines = [];
        for (const medicineInfo of medicineData) {
            const medicine = new Medicine(medicineInfo);
            await medicine.save();
            createdMedicines.push(medicine);
            console.log(`✅ Created medicine: ${medicine.name} (${medicine.medicineId})`);
        }

        // 15. Create Medicine Prescription Items
        console.log('\n📋 Creating medicine prescription items...');
        const medicinePrescriptionItemData = [
            {
                prescriptionId: createdMedicinePrescriptions[0].medicinePrescriptionId,
                appointmentId: createdAppointments[0].appointmentId,
                medicineId: createdMedicines[0].medicineId,
                medicineName: createdMedicines[0].name,
                dosage: '500mg',
                duration: '5 days',
                quantity: 10,
                prescribedBy: createdStaff[0].staffId,
                prescribedDoctorName: createdStaff[0].name,
                patientName: createdPatients[0].name,
                patientAge: 30,
                prescribedDate: new Date(),
                isActive: true
            }
        ];

        const createdMedicinePrescriptionItems = [];
        for (const itemInfo of medicinePrescriptionItemData) {
            const item = new MedicinePrescriptionItem(itemInfo);
            await item.save();
            createdMedicinePrescriptionItems.push(item);
            console.log(`✅ Created medicine prescription item`);
        }

        // 16. Create Medicine Inventory
        console.log('\n📋 Creating medicine inventory...');
        const medicineInventoryData = [
            {
                medicineId: createdMedicines[0].medicineId,
                medicineName: createdMedicines[0].name,
                quantity: 100,
                expiryDate: new Date('2025-12-31'),
                isLowStock: false
            },
            {
                medicineId: createdMedicines[1].medicineId,
                medicineName: createdMedicines[1].name,
                quantity: 50,
                expiryDate: new Date('2025-12-31'),
                isLowStock: false
            }
        ];

        const createdMedicineInventory = [];
        for (const inventoryInfo of medicineInventoryData) {
            const inventory = new MedicineInventory(inventoryInfo);
            await inventory.save();
            createdMedicineInventory.push(inventory);
            console.log(`✅ Created medicine inventory for: ${inventory.medicineName}`);
        }

        // 17. Create Medicine Bills
        console.log('\n📋 Creating medicine bills...');
        const medicineBillData = [
            {
                billId: 'TESTMEDBILL001',
                prescriptionId: createdMedicinePrescriptions[0].medicinePrescriptionId,
                patientName: createdPatients[0].name,
                patientAge: 30,
                prescribedDoctorName: createdStaff[0].name,
                medicines: [
                    {
                        medicineId: createdMedicines[0].medicineId,
                        medicineName: createdMedicines[0].name,
                        quantity: 10,
                        unitPrice: createdMedicines[0].price,
                        totalPrice: createdMedicines[0].price * 10
                    }
                ],
                subtotal: createdMedicines[0].price * 10,
                tax: 0,
                totalAmount: createdMedicines[0].price * 10,
                billDate: new Date(),
                issuedBy: createdStaff[3].name,
                isPaid: true,
                paymentMethod: 'cash'
            }
        ];

        const createdMedicineBills = [];
        for (const billInfo of medicineBillData) {
            const bill = new MedicineBill(billInfo);
            await bill.save();
            createdMedicineBills.push(bill);
            console.log(`✅ Created medicine bill: ${bill.billId}`);
        }

        // 18. Create Test Users
        console.log('\n📋 Creating test users...');
        const userData = [
            {
                username: 'testadmin1',
                password: 'TestAdmin@123',
                name: 'Test Administrator',
                role: 'admin'
            },
            {
                username: 'testdoctor1',
                password: 'TestDoctor@123',
                name: 'Test Doctor',
                role: 'doctor'
            },
            {
                username: 'testreceptionist1',
                password: 'TestReceptionist@123',
                name: 'Test Receptionist',
                role: 'receptionist'
            },
            {
                username: 'testlabtech1',
                password: 'TestLabtech@123',
                name: 'Test Lab Technician',
                role: 'labtech'
            },
            {
                username: 'testpharmacist1',
                password: 'TestPharmacist@123',
                name: 'Test Pharmacist',
                role: 'pharmacist'
            }
        ];

        const createdUsers = [];
        for (const userInfo of userData) {
            const user = new User(userInfo);
            await user.save();
            createdUsers.push(user);
            console.log(`✅ Created user: ${user.username} (${user.role})`);
        }

        // Summary
        console.log('\n🎉 COMPREHENSIVE DATA INSERTION COMPLETED SUCCESSFULLY!');
        console.log('\n📊 SUMMARY:');
        console.log(`✅ Roles: ${createdRoles.length}`);
        console.log(`✅ Specializations: ${createdSpecializations.length}`);
        console.log(`✅ Staff: ${createdStaff.length}`);
        console.log(`✅ Doctors: ${createdDoctors.length}`);
        console.log(`✅ Patients: ${createdPatients.length}`);
        console.log(`✅ Appointments: ${createdAppointments.length}`);
        console.log(`✅ Billing: ${createdBilling.length}`);
        console.log(`✅ Consultations: ${createdConsultations.length}`);
        console.log(`✅ Medicine Prescriptions: ${createdMedicinePrescriptions.length}`);
        console.log(`✅ Lab Test Prescriptions: ${createdLabTestPrescriptions.length}`);
        console.log(`✅ Lab Tests: ${createdLabTests.length}`);
        console.log(`✅ Lab Test Prescription Items: ${createdLabTestPrescriptionItems.length}`);
        console.log(`✅ Lab Test Results: ${createdLabTestResults.length}`);
        console.log(`✅ Medicines: ${createdMedicines.length}`);
        console.log(`✅ Medicine Prescription Items: ${createdMedicinePrescriptionItems.length}`);
        console.log(`✅ Medicine Inventory: ${createdMedicineInventory.length}`);
        console.log(`✅ Medicine Bills: ${createdMedicineBills.length}`);
        console.log(`✅ Users: ${createdUsers.length}`);

        console.log('\n🔗 TEST ENDPOINTS:');
        console.log('POST /api/auth/admin/login (testadmin1 / TestAdmin@123)');
        console.log('POST /api/auth/doctor/login (testdoctor1 / TestDoctor@123)');
        console.log('POST /api/auth/receptionist/login (testreceptionist1 / TestReceptionist@123)');
        console.log('POST /api/auth/labtech/login (testlabtech1 / TestLabtech@123)');
        console.log('POST /api/auth/pharmacist/login (testpharmacist1 / TestPharmacist@123)');

        console.log('\n📋 SAMPLE DATA IDs:');
        console.log(`Patient ID: ${createdPatients[0].patientId}`);
        console.log(`Appointment ID: ${createdAppointments[0].appointmentId}`);
        console.log(`Consultation ID: ${createdConsultations[0].consultationId}`);
        console.log(`Medicine Prescription ID: ${createdMedicinePrescriptions[0].medicinePrescriptionId}`);
        console.log(`Lab Test Prescription ID: ${createdLabTestPrescriptions[0].labTestPrescriptionId}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ ERROR DURING DATA INSERTION:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}); 