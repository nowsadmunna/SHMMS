import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import studentRouter from './routes/student.route.js';
import authRouter from './routes/auth.route.js';
import managaerRouter from './routes/manager.route.js';
import teacherRouter from './routes/teacher.route.js';
import surveyRouter from './routes/survey.route.js';
import noticeRouter from './routes/notice.route.js';
import expenseRouter from './routes/expense.route.js';
import feedbackRouter from './routes/feedback.route.js';
import mealRouter from './routes/meal.route.js';
import refundRouter from './routes/refund.route.js';
import paymentRouter from './routes/payment.route.js';
import Payment from './models/payment.model.js';
import {v4 as uuidv4} from 'uuid';
import Hall from './models/hall.model.js';
import cors from 'cors';
dotenv.config();
export default function generateTransactionId() {
  return `TXN-${uuidv4()}`;
}
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("connected to mongodb");
}).catch((err)=>{
    console.log(err);
});

const app=express();
app.use(express.json());
const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
});
app.use(cors({
    origin: '*', // Allow all origins
    credentials: false, // Allow credentials
}));
app.post('/api/updateregfee',(req,res)=>{
  const{ref,amount,paymentType}=req.body;
  const newPayment=new Payment({ref,amount,paymentType});
  newPayment.save();
  res.status(201).json('registration fee updated');
});
app.post('/api/hallstudent',(req,res)=>{
  const {reg_no,email,department,session,hons_year,name}=req.body;
  const newStudent= new Hall({reg_no,email,department,session,hons_year,name});
  newStudent.save();
  res.status(201).json('hall student added');
});
app.get('/',(req,res)=>{
  res.send('Welcome to SHMMS');
});
app.use('/api/student',studentRouter);
app.use('/api/auth',authRouter);
app.use('/api/manager',managaerRouter);
app.use('/api/teacher',teacherRouter);
app.use('/api/survey',surveyRouter);
app.use('/api/notice',noticeRouter);
app.use('/api/expense',expenseRouter);
app.use('/api/feedback',feedbackRouter);
app.use('/api/meal',mealRouter);
app.use('/api/refund',refundRouter);
app.use('/api/payment',paymentRouter);
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

//middleware for error
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||"internal server error";
    return res.status(statusCode).json({
        success:false,
        statusCode:statusCode,
        message:message
    });
    //from those function next(error)
});