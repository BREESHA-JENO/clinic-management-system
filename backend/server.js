require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const adminRoutes = require('./routers/adminRouter');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const bcrypt=require('bcryptjs');
const app = express();
app.use(express.json());

//Routes
app.use('/api/admin',adminRouter);
app.use('/api/receptionist',receptionistRouter);
app.use('/api/doctor',doctorRouter);
app.use('/api/labtechnician', labtechnicianRouter);
app.use('api/pharmacist',pharmacistRouter)

//connect to DB and start the server
connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
        console.log("hii")
    });
});