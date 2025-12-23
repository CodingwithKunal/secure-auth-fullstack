import { configDotenv } from "dotenv";
configDotenv();

import express from "express";
const app = express();

import mongoose  from "mongoose";
mongoose.set('strictQuery', true);

import setmongodb from './config/mongodb.js'
setmongodb();

import cookieParser  from "cookie-parser";
import cors from "cors";


import authrouter from './router/authRouter.js';
import profileRouter from './router/profileRouter.js';



app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));



app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))




app.use('/api/auth',authrouter);
app.use('/api/user',profileRouter);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log('Server is running on port ' + PORT);
})

