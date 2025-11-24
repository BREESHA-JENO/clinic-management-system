require('dotenv').config();
const mongoose = require('mongoose');
const { generateCounterId } = require('./utils/idGenerator');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        console.log('🧪 Testing Counter model and ID generation...');

        // Test counter ID generation
        const consultationId = await generateCounterId('consultation', 'CONS');
        console.log('✅ Generated consultation ID:', consultationId);

        const medicinePrescriptionId = await generateCounterId('medicinePrescription', 'MEDP');
        console.log('✅ Generated medicine prescription ID:', medicinePrescriptionId);

        const labTestPrescriptionId = await generateCounterId('labTestPrescription', 'LTP');
        console.log('✅ Generated lab test prescription ID:', labTestPrescriptionId);

        console.log('\n🎉 Counter model and ID generation test completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}); 