const { Patient, Appointment, Billing } = require('../models/receptionist');
const { generatePatientId, generateAppointmentId, generateBillingId } = require('../utils/idGenerator');
// Import admin, lab technician, and pharmacy models
const { Staff, Doctor } = require('../models/admin');
const { LabTest, LabTestResult } = require('../models/labtechnician');
const { Medicine, MedicinePrescription } = require('../models/pharmacist');

// ==================== PATIENT MANAGEMENT ====================

// Register Patient
const registerPatient = async (req, res) => {
  try {
    const { name, dob, gender, bloodGroup, status } = req.body;

    // Auto-generate unique patient ID
    const patientId = await generatePatientId();

    const patient = new Patient({
      patientId,
      name,
      dob,
      gender,
      bloodGroup,
      status: status || 'active'
    });

    await patient.save();

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: patient
    });
  } catch (error) {
    console.error('Error registering patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering patient',
      error: error.message
    });
  }
};

// Update Patient Information
const updatePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const updateData = req.body;

    const patient = await Patient.findOneAndUpdate(
      { patientId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating patient',
      error: error.message
    });
  }
};

// Get Patient by ID
const getPatientById = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Error getting patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting patient',
      error: error.message
    });
  }
};

// List All Patients
const listAllPatients = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { patientId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Patient.countDocuments(query);

    res.json({
      success: true,
      data: patients,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPatients: total
      }
    });
  } catch (error) {
    console.error('Error listing patients:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing patients',
      error: error.message
    });
  }
};

// Deactivate Patient
const deactivatePatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findOneAndUpdate(
      { patientId },
      { status: 'inactive' },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      message: 'Patient deactivated successfully',
      data: patient
    });
  } catch (error) {
    console.error('Error deactivating patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating patient',
      error: error.message
    });
  }
};

// Get Patient Complete History (Receptionist View Only)
const getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Get patient details
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Get all appointments for this patient
    const appointments = await Appointment.find({ patientId })
      .sort({ date: -1 });

    // Get all bills for this patient
    const bills = await Billing.find({ 
      appointmentId: { $in: appointments.map(apt => apt.appointmentId) }
    }).sort({ date: -1 });

    res.json({
      success: true,
      data: {
        patient,
        appointments: {
          total: appointments.length,
          list: appointments
        },
        billing: {
          total: bills.length,
          totalAmount: bills.reduce((sum, bill) => sum + bill.amount, 0),
          list: bills
        }
      }
    });
  } catch (error) {
    console.error('Error getting patient history:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting patient history',
      error: error.message
    });
  }
};

// ==================== DOCTOR MANAGEMENT ====================

// Register Doctor
const registerDoctor = async (req, res) => {
  try {
    const { doctorId, name, specialization, email, phone, isActive } = req.body;

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ doctorId });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor with this ID already exists'
      });
    }

    const doctor = new Doctor({
      doctorId,
      name,
      specialization,
      email,
      phone,
      isActive: isActive !== undefined ? isActive : true
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Error registering doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering doctor',
      error: error.message
    });
  }
};

// Get Doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findOne({ doctorId });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error getting doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting doctor',
      error: error.message
    });
  }
};

// List All Doctors
const listAllDoctors = async (req, res) => {
  try {
    const { isActive, specialization, page = 1, limit = 10, search } = req.query;
    
    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }
    if (search) {
      query.$or = [
        { doctorId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }

    const doctors = await Doctor.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Doctor.countDocuments(query);

    res.json({
      success: true,
      data: doctors,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalDoctors: total
      }
    });
  } catch (error) {
    console.error('Error listing doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing doctors',
      error: error.message
    });
  }
};

// Update Doctor
const updateDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const updateData = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      { doctorId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      message: 'Doctor updated successfully',
      data: doctor
    });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating doctor',
      error: error.message
    });
  }
};

// ==================== APPOINTMENT MANAGEMENT ====================

// Schedule Appointment
const scheduleAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, status } = req.body;

    // Auto-generate unique appointment ID
    const appointmentId = await generateAppointmentId();

    // Check if patient exists
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findOne({ doctorId });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const appointment = new Appointment({
      appointmentId,
      patientId,
      doctorId,
      date,
      status: status || 'scheduled'
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Error scheduling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling appointment',
      error: error.message
    });
  }
};

// Update Appointment
const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updateData = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      { appointmentId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating appointment',
      error: error.message
    });
  }
};

// Get Appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findOne({ appointmentId });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Error getting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting appointment',
      error: error.message
    });
  }
};

// List Appointments by Date
const listAppointmentsByDate = async (req, res) => {
  try {
    const { date, status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: appointments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalAppointments: total
      }
    });
  } catch (error) {
    console.error('Error listing appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing appointments',
      error: error.message
    });
  }
};

// Cancel Appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findOneAndUpdate(
      { appointmentId },
      { status: 'cancelled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment',
      error: error.message
    });
  }
};

// List Appointments by Patient
const listAppointmentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const appointments = await Appointment.find({ patientId })
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments({ patientId });

    res.json({
      success: true,
      data: appointments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalAppointments: total
      }
    });
  } catch (error) {
    console.error('Error listing patient appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing patient appointments',
      error: error.message
    });
  }
};

// List Appointments by Doctor
const listAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const appointments = await Appointment.find({ doctorId })
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments({ doctorId });

    res.json({
      success: true,
      data: appointments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalAppointments: total
      }
    });
  } catch (error) {
    console.error('Error listing doctor appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing doctor appointments',
      error: error.message
    });
  }
};

// ==================== BILLING MANAGEMENT ====================

// Generate Appointment Bill
const generateAppointmentBill = async (req, res) => {
  try {
    const { appointmentId, amount, date, status } = req.body;

    // Auto-generate unique billing ID
    const billingId = await generateBillingId();

    // Check if appointment exists
    const appointment = await Appointment.findOne({ appointmentId });
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const billing = new Billing({
      billingId,
      appointmentId,
      amount,
      date: date || new Date(),
      status: status || 'pending'
    });

    await billing.save();

    res.status(201).json({
      success: true,
      message: 'Bill generated successfully',
      data: billing
    });
  } catch (error) {
    console.error('Error generating bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating bill',
      error: error.message
    });
  }
};

// Update Appointment Bill
const updateAppointmentBill = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updateData = req.body;

    const billing = await Billing.findOneAndUpdate(
      { appointmentId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    res.json({
      success: true,
      message: 'Bill updated successfully',
      data: billing
    });
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bill',
      error: error.message
    });
  }
};

// Get Bill by Appointment ID
const getBillByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const billing = await Billing.findOne({ appointmentId });

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    res.json({
      success: true,
      data: billing
    });
  } catch (error) {
    console.error('Error getting bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting bill',
      error: error.message
    });
  }
};

// List Bills by Date Range
const listBillsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (status) {
      query.status = status;
    }

    const bills = await Billing.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Billing.countDocuments(query);

    res.json({
      success: true,
      data: bills,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBills: total
      }
    });
  } catch (error) {
    console.error('Error listing bills:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing bills',
      error: error.message
    });
  }
};

// Record Payment
const recordPayment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const billing = await Billing.findOneAndUpdate(
      { appointmentId },
      { status: status || 'paid' },
      { new: true }
    );

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    res.json({
      success: true,
      message: 'Payment recorded successfully',
      data: billing
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording payment',
      error: error.message
    });
  }
};

// Get Billing Statistics
const getBillingStats = async (req, res) => {
  try {
    const totalBills = await Billing.countDocuments();
    const pendingBills = await Billing.countDocuments({ status: 'pending' });
    const paidBills = await Billing.countDocuments({ status: 'paid' });
    const cancelledBills = await Billing.countDocuments({ status: 'cancelled' });

    const totalAmount = await Billing.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalBills,
        pendingBills,
        paidBills,
        cancelledBills,
        totalAmount: totalAmount[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Error getting billing stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting billing statistics',
      error: error.message
    });
  }
};

// Get Receptionist Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    // Today's appointments
    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // Today's completed appointments
    const todayCompletedAppointments = await Appointment.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: 'completed'
    });

    // Today's pending appointments
    const todayPendingAppointments = await Appointment.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['scheduled', 'confirmed'] }
    });

    // Today's revenue
    const todayRevenue = await Billing.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay },
          status: 'paid'
        }
      },
      {
        $group: { _id: null, total: { $sum: '$amount' } }
      }
    ]);

    // Total patients
    const totalPatients = await Patient.countDocuments({ status: 'active' });

    // Total doctors
    const totalDoctors = await Doctor.countDocuments({ isActive: true });

    // Recent appointments (last 5)
    const recentAppointments = await Appointment.find()
      .sort({ date: -1 })
      .limit(5);

    // Recent patients (last 5)
    const recentPatients = await Patient.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        today: {
          appointments: todayAppointments,
          completedAppointments: todayCompletedAppointments,
          pendingAppointments: todayPendingAppointments,
          revenue: todayRevenue[0]?.total || 0
        },
        total: {
          patients: totalPatients,
          doctors: totalDoctors
        },
        recent: {
          appointments: recentAppointments,
          patients: recentPatients
        }
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting dashboard statistics',
      error: error.message
    });
  }
};

// Health Check
const healthCheck = async (req, res) => {
  res.json({
    success: true,
    message: 'Receptionist API is running',
    timestamp: new Date().toISOString()
  });
};

// List all staff (admin integration)
const listAllStaff = async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { staffId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const staff = await Staff.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Staff.countDocuments(query);
    res.json({
      success: true,
      data: staff,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalStaff: total
      }
    });
  } catch (error) {
    console.error('Error listing staff:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing staff',
      error: error.message
    });
  }
};

// List all lab tests (lab technician integration)
const listAllLabTests = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { testId: { $regex: search, $options: 'i' } },
        { testName: { $regex: search, $options: 'i' } }
      ];
    }
    const labTests = await LabTest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await LabTest.countDocuments(query);
    res.json({
      success: true,
      data: labTests,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalLabTests: total
      }
    });
  } catch (error) {
    console.error('Error listing lab tests:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing lab tests',
      error: error.message
    });
  }
};

// List all lab test results (lab technician integration)
const listAllLabResults = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { resultId: { $regex: search, $options: 'i' } },
        { patientName: { $regex: search, $options: 'i' } },
        { testId: { $regex: search, $options: 'i' } }
      ];
    }
    const labResults = await LabTestResult.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await LabTestResult.countDocuments(query);
    res.json({
      success: true,
      data: labResults,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalLabResults: total
      }
    });
  } catch (error) {
    console.error('Error listing lab results:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing lab results',
      error: error.message
    });
  }
};

// List all medicines (pharmacy integration)
const listAllMedicines = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { medicineId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }
    const medicines = await Medicine.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Medicine.countDocuments(query);
    res.json({
      success: true,
      data: medicines,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalMedicines: total
      }
    });
  } catch (error) {
    console.error('Error listing medicines:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing medicines',
      error: error.message
    });
  }
};

// List all medicine prescriptions (pharmacy integration)
const listAllPrescriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { prescriptionId: { $regex: search, $options: 'i' } },
        { patientName: { $regex: search, $options: 'i' } },
        { medicineName: { $regex: search, $options: 'i' } }
      ];
    }
    const prescriptions = await MedicinePrescription.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await MedicinePrescription.countDocuments(query);
    res.json({
      success: true,
      data: prescriptions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPrescriptions: total
      }
    });
  } catch (error) {
    console.error('Error listing prescriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing prescriptions',
      error: error.message
    });
  }
};

module.exports = {
  // Patient Management
  registerPatient,
  updatePatient,
  getPatientById,
  listAllPatients,
  deactivatePatient,
  getPatientHistory,
  
  // Doctor Management
  registerDoctor,
  getDoctorById,
  listAllDoctors,
  updateDoctor,
  
  // Appointment Management
  scheduleAppointment,
  updateAppointment,
  getAppointmentById,
  listAppointmentsByDate,
  cancelAppointment,
  listAppointmentsByPatient,
  listAppointmentsByDoctor,
  
  // Billing Management
  generateAppointmentBill,
  updateAppointmentBill,
  getBillByAppointmentId,
  listBillsByDateRange,
  recordPayment,
  getBillingStats,
  
  // Dashboard & Statistics
  getDashboardStats,
  
  // Health Checkgit 
  healthCheck,
  
  // New integrations
  listAllStaff,
  listAllLabTests,
  listAllLabResults,
  listAllMedicines,

  listAllPrescriptions
};

