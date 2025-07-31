require('dotenv').config();
const cors=require('cors');
const connectDB=require('./config/db');

const adminRouter=require('./routers/adminRouter');
const receptionistRouter=require('./routers/receptionistRouter');
const doctorRouter=require('./routers/doctorRouter');
const labtechnicianRouter = require('./routers/labtechnicianRouter');
const pharmacistRouter=require('./routers/pharmacistRouter')

const PORT=process.env.PORT||8000;
const app=express();

//middleware -->act between req and res
app.use(cors());
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
    });
});