const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routers
const adminRouter = require('./routers/adminRouter');           // OK
const receptionistRouter = require('./routers/receptionistRouter'); // OK
const doctorRouter = require('./routers/doctorRouter');         // OK
const labtechnicianRouter = require('./routers/labtechnicianRouter'); // OK
const pharmacistRouter = require('./routers/pharmacistRouter'); // OK


const PORT = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRouter);
app.use('/api/receptionist', receptionistRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/labtechnician', labtechnicianRouter);
app.use('/api/pharmacist', pharmacistRouter);

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Hi");
  });
});
