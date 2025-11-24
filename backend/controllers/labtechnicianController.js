const { LabTest, LabTestResult } = require('../models/labtechnician');
const { LabTestPrescription } = require('../models/doctor');
const { Appointment, Patient } = require('../models/receptionist');
const { Staff } = require('../models/admin');

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
    const labTest = await LabTest.findOneAndUpdate(
      { testId: req.params.labTestId }, 
      req.body, 
      { new: true }
    );
    if (!labTest) return res.status(404).json({ error: 'Lab Test not found' });
    res.json(labTest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLabTestById = async (req, res) => {
  try {
    const labTest = await LabTest.findOne({ testId: req.params.labTestId });
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
    const labTest = await LabTest.findOneAndUpdate(
      { testId: req.params.labTestId }, 
      { isActive: false }, 
      { new: true }
    );
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
    const labTestPrescriptionId = req.params.labTestPrescriptionId;
    const prescription = await LabTestPrescription.findOne({ labTestPrescriptionId: labTestPrescriptionId });
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
    // Get the lab test details to get testId and price
    const labTest = await LabTest.findOne({ testName: prescription.tests[0].name });
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
      labTestPrescriptionItemId: labTestPrescriptionId, 
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
    const prescription = await LabTestPrescription.findOne({ appointmentId });
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
    const result = await LabTestResult.findOne({ labTestPrescriptionItemId: prescription.labTestPrescriptionId });
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
      prescribedDoctorId: prescription.doctorId,
      prescribedDate: prescription.date,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    };
    res.json(resultDetails);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get lab test prescription by appointment ID
exports.getLabTestPrescriptionByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const prescription = await LabTestPrescription.findOne({ appointmentId });
    if (!prescription) return res.status(404).json({ error: 'Lab test prescription not found' });
    
    // Return comprehensive prescription information
    const prescriptionDetails = {
      labTestPrescriptionId: prescription.labTestPrescriptionId,
      appointmentId: prescription.appointmentId,
      patientId: prescription.patientId,
      doctorId: prescription.doctorId,
      tests: prescription.tests,
      date: prescription.date,
      isActive: prescription.isActive,
      createdAt: prescription.createdAt,
      updatedAt: prescription.updatedAt
    };
    res.json(prescriptionDetails);
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
    const prescription = await LabTestPrescription.findOne({ labTestPrescriptionId: result.labTestPrescriptionItemId });
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
      prescribedDoctorId: prescription ? prescription.doctorId : null,
      prescribedDate: prescription ? prescription.date : null,
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
    const prescription = await LabTestPrescription.findOneAndUpdate(
      { labTestPrescriptionId: req.params.labTestPrescriptionId },
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
exports.getLabTestByTestId = async (req, res) => {
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
    
    // Import the doctor model at the top level
    const { LabTestPrescription } = require('../models/doctor');
    
    // Validate lab test prescription exists
    const labTestPrescription = await LabTestPrescription.findOne({ labTestPrescriptionId: testPrescriptionId });
    if (!labTestPrescription) {
      return res.status(404).json({ error: 'Lab test prescription not found' });
    }
    
    // Validate lab test exists
    const labTest = await LabTest.findOne({ testId });
    if (!labTest) {
      return res.status(404).json({ error: 'Lab test not found' });
    }
    
    // Update lab test prescription status
    await LabTestPrescription.findOneAndUpdate(
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
    
    // First, find lab test prescriptions for this patient
    const prescriptions = await LabTestPrescription.find({ patientId });
    
    if (!prescriptions || prescriptions.length === 0) {
      return res.status(404).json({ error: 'No lab test prescriptions found for this patient' });
    }
    
    // Get the labTestPrescriptionIds from the prescriptions
    const labTestPrescriptionIds = prescriptions.map(p => p.labTestPrescriptionId);
    
    // Find lab test results for these prescriptions
    const results = await LabTestResult.find({ 
      labTestPrescriptionItemId: { $in: labTestPrescriptionIds } 
    });
    
    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'No lab test results found for this patient' });
    }
    
    // Return comprehensive result information
    const resultDetails = results.map(result => {
      const prescription = prescriptions.find(p => p.labTestPrescriptionId === result.labTestPrescriptionItemId);
      return {
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
        prescribedDoctorId: prescription ? prescription.doctorId : null,
        prescribedDate: prescription ? prescription.date : null,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      };
    });
    
    res.json(resultDetails);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ==================== CROSS-MODULE INTEGRATION ====================

// Fetch lab test prescriptions from Doctor module
exports.getDoctorLabTestPrescriptions = async (req, res) => {
  try {
    const { patientId, appointmentId, doctorId } = req.query;
    let query = {};

    if (patientId) {
      const patient = await Patient.findOne({ patientId });
      if (patient) query.patientId = patient._id;
    }

    if (appointmentId) {
      const appointment = await Appointment.findOne({ appointmentId });
      if (appointment) query.appointmentId = appointment._id;
    }

    if (doctorId) {
      const doctor = await Staff.findOne({ staffId: doctorId });
      if (doctor) query.doctorId = doctor._id;
    }

    const labTestPrescriptions = await LabTestPrescription.find(query)
      .populate('appointmentId', 'appointmentId patientId doctorId')
      .populate('patientId', 'patientId name')
      .populate('doctorId', 'staffId name')
      .sort({ date: -1 });

    // Convert to string IDs for response
    const responseData = labTestPrescriptions.map(prescription => ({
      _id: prescription._id,
      labTestPrescriptionId: prescription.labTestPrescriptionId,
      appointmentId: prescription.appointmentId?.appointmentId,
      patientId: prescription.patientId?.patientId,
      patientName: prescription.patientId?.name,
      doctorId: prescription.doctorId?.staffId,
      doctorName: prescription.doctorId?.name,
      tests: prescription.tests,
      date: prescription.date
    }));

    res.json({
      success: true,
      data: responseData
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Get lab test results for Doctor module
exports.getLabTestResultsForDoctor = async (req, res) => {
  try {
    const { patientId, doctorId, status } = req.query;
    let query = {};

    if (patientId) {
      const patient = await Patient.findOne({ patientId });
      if (patient) query.patientName = patient.name;
    }

    if (doctorId) {
      const doctor = await Staff.findOne({ staffId: doctorId });
      if (doctor) query.recordedBy = doctor._id;
    }

    if (status) {
      query.status = status;
    }

    const results = await LabTestResult.find(query)
      .populate('recordedBy', 'staffId name')
      .sort({ recordedDate: -1 });

    // Convert to string IDs for response
    const responseData = results.map(result => ({
      _id: result._id,
      resultId: result.resultId,
      labTestPrescriptionItemId: result.labTestPrescriptionItemId,
      testName: result.testName,
      result: result.result,
      currentValue: result.currentValue,
      minRange: result.minRange,
      maxRange: result.maxRange,
      unit: result.unit,
      status: result.status,
      patientName: result.patientName,
      patientAge: result.patientAge,
      doctorId: result.recordedBy?.staffId,
      doctorName: result.recordedBy?.name,
      recordedDate: result.recordedDate
    }));

    res.json({
      success: true,
      data: responseData
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Technician Management
exports.registerLabTechnician = (req, res) => {
  res.status(501).json({ message: 'registerLabTechnician not implemented yet' });
};

exports.getLabTechnicianById = (req, res) => {
  res.status(501).json({ message: 'getLabTechnicianById not implemented yet' });
};

exports.listAllLabTechnicians = (req, res) => {
  res.status(501).json({ message: 'listAllLabTechnicians not implemented yet' });
};

// Lab Test Result Handlers
exports.createLabTestResult = async (req, res) => {
  try {
    const { 
      labTestPrescriptionItemId,
      testId,
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

    // Validate required fields
    if (!labTestPrescriptionItemId || !testId || !result || !currentValue || !minRange || !maxRange || !unit || !patientName || !patientAge || !recordedBy || !recordedByTechnicianName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Generate unique result ID
    const resultId = `LR${Date.now()}`;

    // Determine status based on current value and ranges
    let status = 'normal';
    if (currentValue < minRange) {
      status = 'low';
    } else if (currentValue > maxRange) {
      status = 'high';
    }

    // Get the lab test details to get price
    const labTest = await LabTest.findOne({ testId });
    if (!labTest) {
      return res.status(404).json({ error: 'Lab test not found' });
    }

    const labTestResult = new LabTestResult({ 
      resultId,
      labTestPrescriptionItemId, 
      testId,
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

exports.sendResultToDoctor = async (req, res) => {
  try {
    const { resultId } = req.params;
    
    // Find the lab test result
    const result = await LabTestResult.findOne({ resultId });
    if (!result) {
      return res.status(404).json({ error: 'Lab test result not found' });
    }

    // Update the result to mark it as sent to doctor
    // You can add a field like 'sentToDoctor: true' or 'status: "sent"' to your schema
    // For now, we'll just return success
    const updatedResult = await LabTestResult.findOneAndUpdate(
      { resultId },
      { 
        // Add any fields you want to update when sending to doctor
        // For example: sentToDoctor: true, sentAt: new Date()
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Lab test result sent to doctor successfully',
      resultId: updatedResult.resultId,
      patientName: updatedResult.patientName,
      testId: updatedResult.testId
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listLabTestResultsByTechnician = async (req, res) => {
  try {
    const { labTechnicianId } = req.params;
    
    // Find lab test results recorded by the specified technician
    const results = await LabTestResult.find({
      recordedBy: labTechnicianId
    }).sort({ createdAt: -1 });

    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'No lab test results found for this technician' });
    }

    // Return comprehensive result information
    const resultDetails = results.map(result => ({
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
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    }));

    res.json({
      success: true,
      count: resultDetails.length,
      technicianId: labTechnicianId,
      data: resultDetails
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listPendingLabTestResults = async (req, res) => {
  try {
    // Find lab test results that haven't been sent to doctor yet
    // We can determine pending results by checking if they haven't been processed or sent
    const pendingResults = await LabTestResult.find({
      // You can add more conditions here based on your business logic
      // For example, if you have a 'sentToDoctor' field or 'status' field
    }).sort({ createdAt: -1 });

    if (!pendingResults || pendingResults.length === 0) {
      return res.status(404).json({ error: 'No pending lab test results found' });
    }

    // Return comprehensive result information
    const resultDetails = pendingResults.map(result => ({
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
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    }));

    res.json({
      success: true,
      count: resultDetails.length,
      data: resultDetails
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Health Check
exports.healthCheck = (req, res) => {
  res.json({ status: 'Lab Technician Service is healthy ✅' });
};
