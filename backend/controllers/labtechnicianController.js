<<<<<<< HEAD
const { LabTestResult, LabTechnician } = require('../models/labtechnician');
const { LabTestPrescription } = require('../models/doctor');
const { Appointment, Patient, Doctor } = require('../models/receptionist');
const { generateLabTestResultId } = require('../utils/idGenerator');

// ==================== LAB TECHNICIAN MANAGEMENT ====================

// Register Lab Technician
const registerLabTechnician = async (req, res) => {
  try {
    const { labTechnicianId, name, email, phone, specialization, isActive } = req.body;

    // Check if lab technician already exists
    const existingTechnician = await LabTechnician.findOne({ labTechnicianId });
    if (existingTechnician) {
      return res.status(400).json({
        success: false,
        message: 'Lab Technician with this ID already exists'
      });
    }

    const labTechnician = new LabTechnician({
      labTechnicianId,
      name,
      email,
      phone,
      specialization,
      isActive: isActive !== undefined ? isActive : true
    });

    await labTechnician.save();

    res.status(201).json({
      success: true,
      message: 'Lab Technician registered successfully',
      data: labTechnician
    });
  } catch (error) {
    console.error('Error registering lab technician:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering lab technician',
      error: error.message
    });
  }
};

// Get Lab Technician by ID
const getLabTechnicianById = async (req, res) => {
  try {
    const { labTechnicianId } = req.params;

    const labTechnician = await LabTechnician.findOne({ labTechnicianId });

    if (!labTechnician) {
      return res.status(404).json({
        success: false,
        message: 'Lab Technician not found'
      });
    }

    res.json({
      success: true,
      data: labTechnician
    });
  } catch (error) {
    console.error('Error getting lab technician:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting lab technician',
      error: error.message
    });
  }
};

// List All Lab Technicians
const listAllLabTechnicians = async (req, res) => {
  try {
    const { isActive, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const labTechnicians = await LabTechnician.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LabTechnician.countDocuments(query);

    res.json({
      success: true,
      data: labTechnicians,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalLabTechnicians: total
      }
    });
  } catch (error) {
    console.error('Error listing lab technicians:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing lab technicians',
      error: error.message
    });
  }
};

// ==================== LAB TEST RESULTS MANAGEMENT ====================

// Create Lab Test Result
const createLabTestResult = async (req, res) => {
  try {
    const { labPrescriptionId, labTechnicianId, testResults, notes } = req.body;

    // Auto-generate unique result ID
    const resultId = await generateLabTestResultId();

    // Check if lab prescription exists
    const labPrescription = await LabTestPrescription.findOne({ labPrescriptionId });
    if (!labPrescription) {
      return res.status(404).json({
        success: false,
        message: 'Lab prescription not found'
      });
    }

    // Check if lab technician exists
    const labTechnician = await LabTechnician.findOne({ labTechnicianId });
    if (!labTechnician) {
      return res.status(404).json({
        success: false,
        message: 'Lab technician not found'
      });
    }

    // Check if appointment exists
    const appointment = await Appointment.findOne({ appointmentId: labPrescription.appointmentId });
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const labTestResult = new LabTestResult({
      resultId,
      labPrescriptionId,
      appointmentId: labPrescription.appointmentId,
      patientId: labPrescription.patientId,
      doctorId: labPrescription.doctorId,
      labTechnicianId,
      testResults,
      status: 'completed',
      completedDate: new Date(),
      doctorNotes: notes
    });

    await labTestResult.save();

    res.status(201).json({
      success: true,
      message: 'Lab test result created successfully',
      data: labTestResult
    });
  } catch (error) {
    console.error('Error creating lab test result:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating lab test result',
      error: error.message
    });
  }
};

// Send Lab Test Result to Doctor
const sendResultToDoctor = async (req, res) => {
  try {
    const { resultId } = req.params;

    const labTestResult = await LabTestResult.findOneAndUpdate(
      { resultId },
      { 
        status: 'sent_to_doctor',
        sentToDoctorDate: new Date()
      },
      { new: true }
    );

    if (!labTestResult) {
      return res.status(404).json({
        success: false,
        message: 'Lab test result not found'
      });
    }

    res.json({
      success: true,
      message: 'Lab test result sent to doctor successfully',
      data: labTestResult
    });
  } catch (error) {
    console.error('Error sending result to doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending result to doctor',
      error: error.message
    });
  }
};

// Get Lab Test Result by ID
const getLabTestResultById = async (req, res) => {
  try {
    const { resultId } = req.params;

    const labTestResult = await LabTestResult.findOne({ resultId });

    if (!labTestResult) {
      return res.status(404).json({
        success: false,
        message: 'Lab test result not found'
      });
    }

    res.json({
      success: true,
      data: labTestResult
    });
  } catch (error) {
    console.error('Error getting lab test result:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting lab test result',
      error: error.message
    });
  }
};

// List Lab Test Results by Lab Technician
const listLabTestResultsByTechnician = async (req, res) => {
  try {
    const { labTechnicianId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { labTechnicianId };
    if (status) {
      query.status = status;
    }

    const labTestResults = await LabTestResult.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LabTestResult.countDocuments(query);

    res.json({
      success: true,
      data: labTestResults,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalResults: total
      }
    });
  } catch (error) {
    console.error('Error listing lab test results:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing lab test results',
      error: error.message
    });
  }
};

// List Pending Lab Test Results
const listPendingLabTestResults = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const labTestResults = await LabTestResult.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LabTestResult.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      data: labTestResults,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPendingResults: total
      }
    });
  } catch (error) {
    console.error('Error listing pending lab test results:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing pending lab test results',
      error: error.message
    });
  }
};

// Health Check
const healthCheck = async (req, res) => {
  res.json({
    success: true,
    message: 'Lab Technician API is running',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  // Lab Technician Management
  registerLabTechnician,
  getLabTechnicianById,
  listAllLabTechnicians,
  
  // Lab Test Results Management
  createLabTestResult,
  sendResultToDoctor,
  getLabTestResultById,
  listLabTestResultsByTechnician,
  listPendingLabTestResults,
  
  // Health Check
  healthCheck
};
=======
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
>>>>>>> d890af73c091528a847f4dd611078c653778c3e1
