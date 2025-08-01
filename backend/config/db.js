//connecting node.js app to MongoDB using a tool called mongoose
const mongoose=require('mongoose');
<<<<<<< HEAD

const connectDB=async()=>{
    try{
        // Use local MongoDB connection string
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clinic_management_system';
        
        await mongoose.connect(mongoURI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log('MongoDB connected successfully')
    }catch(err){
        console.error('MongoDB connection error:', err.message);
        console.log('Please install MongoDB or set MONGO_URI environment variable');
        console.log('To install MongoDB: https://docs.mongodb.com/manual/installation/');
=======
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log('MongoDB connected')
    }catch(err){
        console.error(err.message);
>>>>>>> d890af73c091528a847f4dd611078c653778c3e1
        process.exit(1);
    }
};

module.exports=connectDB;