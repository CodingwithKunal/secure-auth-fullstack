import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    
    name:{type:String, required:true },
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    verfiedotp:{type:String, default:null},
    expireverfyotp:{type:Date, default:null},
    isvarified:{type:Boolean, default:false},
    resetpasswordotp:{type:String, default:null},
    expireresetotp:{type:Date, default:null},
    profilepic:{type:String, default:null},

})
const usermodel = mongoose.model("user", userschema);
export default usermodel;