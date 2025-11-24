// Connecting node.js app to MongoDB using mongoose
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Use local MongoDB connection string
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinic_management_system';
        
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        console.log('Please install MongoDB or set MONGO_URI environment variable');
        console.log('To install MongoDB: https://docs.mongodb.com/manual/installation/');
        process.exit(1);
    }
};

module.exports = connectDB;