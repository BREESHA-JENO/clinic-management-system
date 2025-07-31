const { LabTest, LabTestPrescriptionItem, LabTestResult } = require('../models/labtechnician');

// Lab Test Management
exports.addLabTest = async (req, res) => {
  try {
    const { testName, description, price } = req.body;
    
    // Generate a unique test ID
    const testId = `LT${Date.now()}`;
    
    const labTest = new LabTest({
      testId,
      testName,
      description,
      price
    });
    await labTest.save();
    res.status(201).json(labTest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateLabTest = async (req, res) => {
  try {
    const labTest = await LabTest.findByIdAndUpdate(req.params.labTestId, req.body, { new: true });
    if (!labTest) return res.status(404).json({ error: 'Lab Test not found' });
    res.json(labTest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLabTestById = async (req, res) => {
  try {
    const labTest = await LabTest.findById(req.params.labTestId);
    if (!labTest) return res.status(404).json({ error: 'Lab Test not found' });
    
    // Return detailed lab test information
    const labTestDetails = {
      testId: labTest.testId,
      testName: labTest.testName,
      description: labTest.description,
      price: labTest.price,
      isActive: labTest.isActive,
      createdAt: labTest.createdAt,
      updatedAt: labTest.updatedAt
    };
    
    res.json(labTestDetails);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listLabTests = async (req, res) => {
  try {
    const labTests = await LabTest.find();
    res.json(labTests);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deactivateLabTest = async (req, res) => {
  try {
    const labTest = await LabTest.findByIdAndUpdate(req.params.labTestId, { isActive: false }, { new: true });
    if (!labTest) return res.status(404).json({ error: 'Lab Test not found' });
    res.json(labTest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lab Test Prescription Management
exports.recordLabTestResult = async (req, res) => {
  try {
    const { 
      result, 
      currentValue, 
      minRange, 
      maxRange, 
      unit, 
      patientName, 
      patientAge, 
      recordedBy, 
      recordedByTechnicianName 
    } = req.body;
    
    const labTestPrescriptionItemId = req.params.labTestPrescriptionId;
    const prescription = await LabTestPrescriptionItem.findById(labTestPrescriptionItemId);
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
    
    // Get the lab test details to get testId and price
    const labTest = await LabTest.findById(prescription.labTestId);
    if (!labTest) return res.status(404).json({ error: 'Lab Test not found' });
    
    // Generate unique result ID
    const resultId = `LR${Date.now()}`;
    
    // Determine status based on current value and ranges
    let status = 'normal';
    if (currentValue < minRange) {
      status = 'low';
    } else if (currentValue > maxRange) {
      status = 'high';
    }
    // You can add more logic for 'critical' status if needed
    
    const labTestResult = new LabTestResult({ 
      resultId,
      labTestPrescriptionItemId, 
      testId: labTest.testId,
      result, 
      currentValue,
      minRange,
      maxRange,
      unit,
      price: labTest.price,
      patientName,
      patientAge,
      recordedBy,
      recordedByTechnicianName,
      status,
      resultDate: new Date()
    });
    await labTestResult.save();
    res.status(201).json(labTestResult);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLabTestResultByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const prescription = await LabTestPrescriptionItem.findOne({ appointmentId });
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
    const result = await LabTestResult.findOne({ labTestPrescriptionItemId: prescription._id });
    if (!result) return res.status(404).json({ error: 'Result not found' });
    
    // Return comprehensive result information
    const resultDetails = {
      resultId: result.resultId,
      testId: result.testId,
      result: result.result,
      currentValue: result.currentValue,
      minRange: result.minRange,
      maxRange: result.maxRange,
      unit: result.unit,
      status: result.status,
      price: result.price,
      patientName: result.patientName,
      patientAge: result.patientAge,
      recordedByTechnicianName: result.recordedByTechnicianName,
      recordedAt: result.recordedAt,
      resultDate: result.resultDate,
      prescribedDoctorName: prescription.prescribedDoctorName,
      prescribedDate: prescription.prescribedDate,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    };
    
    res.json(resultDetails);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get lab test result by result ID
exports.getLabTestResultById = async (req, res) => {
  try {
    const { resultId } = req.params;
    const result = await LabTestResult.findOne({ resultId });
    if (!result) return res.status(404).json({ error: 'Lab test result not found' });
    
    // Get prescription details
    const prescription = await LabTestPrescriptionItem.findById(result.labTestPrescriptionItemId);
    
    // Return comprehensive result information
    const resultDetails = {
      resultId: result.resultId,
      testId: result.testId,
      result: result.result,
      currentValue: result.currentValue,
      minRange: result.minRange,
      maxRange: result.maxRange,
      unit: result.unit,
      status: result.status,
      price: result.price,
      patientName: result.patientName,
      patientAge: result.patientAge,
      recordedByTechnicianName: result.recordedByTechnicianName,
      recordedAt: result.recordedAt,
      resultDate: result.resultDate,
      prescribedDoctorName: prescription ? prescription.prescribedDoctorName : null,
      prescribedDate: prescription ? prescription.prescribedDate : null,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    };
    
    res.json(resultDetails);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listLabTestResultsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const results = await LabTestResult.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });
    res.json(results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deactivateLabTestPrescription = async (req, res) => {
  try {
    const prescription = await LabTestPrescriptionItem.findByIdAndUpdate(
      req.params.labTestPrescriptionId,
      { isActive: false },
      { new: true }
    );
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
    res.json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Integration functions for Doctor module
exports.getLabTestById = async (req, res) => {
  try {
    const { testId } = req.params;
    const labTest = await LabTest.findOne({ testId });
    if (!labTest) return res.status(404).json({ error: 'Lab test not found' });
    res.json(labTest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLabTestsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    // This would filter lab tests based on category
    const labTests = await LabTest.find({ isActive: true });
    res.json(labTests);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.processDoctorLabTestPrescription = async (req, res) => {
  try {
    const { testPrescriptionId, testId, patientId, doctorId } = req.body;
    
    // Validate lab test prescription exists
    const labTestPrescription = await require('../models/doctor').LabTestPrescription.findOne({ labTestPrescriptionId: testPrescriptionId });
    if (!labTestPrescription) {
      return res.status(404).json({ error: 'Lab test prescription not found' });
    }

    // Validate lab test exists
    const labTest = await LabTest.findOne({ testId });
    if (!labTest) {
      return res.status(404).json({ error: 'Lab test not found' });
    }

    // Update lab test prescription status
    await require('../models/doctor').LabTestPrescription.findOneAndUpdate(
      { labTestPrescriptionId: testPrescriptionId },
      { status: 'in_progress' }
    );

    res.json({ 
      message: 'Lab test prescription processed successfully',
      testPrescriptionId,
      testId,
      testName: labTest.testName
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLabTestResultsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const results = await LabTestResult.find({ patientId });
    res.json(results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
