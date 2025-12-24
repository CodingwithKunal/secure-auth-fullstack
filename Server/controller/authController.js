import usermodel from "../Models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from 'cookie-parser'
import transporter from "../config/nodmailer.js";







export const createUser = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Please fill all the fields" });
    }
    try {
        const useremail = await usermodel.findOne({ email: email });
        if (useremail) {
            return res.status(400).json({ success: false, message: "User already Exist ! Try different Email." })
        }
        // then create hash password
        const gensalt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, gensalt)
        // then create user register
        const user = await usermodel.create({
            name,
            email,
            password: hash
        });
        // create user token 
        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        // store token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        

        // Then we send Email verification code 
        const otp = Math.floor(100000 + Math.random() * 800000).toString()
        user.verfiedotp = otp
        user.expireverfyotp = Date.now() + 30 * 60 * 1000;
        await user.save()

        return res.status(200).json({ success: true, message: "Enter your Verification Code that we sent in your Email for comfirmation.", userID: user._id })


        transporter.sendMail = ({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome Kunal Authentication World",
            text: `Good to see you in our World . Hii ${name} this is your Verification Code ${otp}. Make sure it will Expire in 30 minutes.`
        })
       
        
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


export const enterVerfication = async (req, res) => {


    const { otp, userID } = req.body;
    if (!userID || !otp) {
        return res.status(400).json({ success: false, message: "Missing Details! try again" })
    }

    try {

        const user = await usermodel.findById(userID)
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found ? try again" })
        }

        if (user.verfiedotp === '' || user.verfiedotp !== otp) {
            return res.status(400).json({ success: false, message: "You want to Enter Correct Verification code to continue." })

        }

        if (user.expireverfyotp < Date.now()) {
            return res.status(400).json({ success: false, message: "Your Verification Code is Expire !" })
        }

        user.isvarified = true
        user.resetpasswordotp = null
        user.expireresetotp = null
        await user.save()

        return res.status(200).json({ success: true, message: "Thank you for comfirming your Verification code && Continue with our website." })


    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


export const resendOtp = async (req, res) => {
    const { userID, type } = req.body;

    if (!userID || !type) {
        return res.status(400).json({
            success: false,
            message: "Missing details!"
        });
    }

    try {
        const user = await usermodel.findById(userID);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        const newOTP = Math.floor(100000 + Math.random() * 900000).toString();

        //  Handle BOTH OTP types
        
        if (type === "verify") {
            user.verfiedotp = newOTP;
            user.expireverfyotp = Date.now() + 5 * 60 * 1000;
        }

        if (type === "reset") {
            user.resetpasswordotp = newOTP;
            user.expireresetotp = Date.now() + 5 * 60 * 1000;
        }

        await user.save();

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: type === "verify"
                ? "Verification Code"
                : "Reset Password OTP",
            text: `Your OTP is ${newOTP}. It expires in 5 minutes.`
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully.",
            userID: user._id
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please fill all the fields" });
    }
    try {

        const user = await usermodel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Incorrect email or password. Please try again !" })
        }
        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) {
            return res.status(400).json({ success: false, message: "Incorrect email or password. Please try again !" })
        }

        // create user token for login
        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        // store token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        user.isvarified = true;
        user.resetpasswordotp = null;
        user.expireresetotp = null;
        await user.save();

        return res.status(200).json({ success: true, message: "You are logged in successfully." })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}





export const logoutUser = async (req, res) => {
    try {

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({ success: true, message: "You are logged out successfully." })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}




export const sendResetPasswordOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: "Please provide your email address." })
    }

    try {

        const user = await usermodel.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found please register first !" })
        }
        const otp = Math.floor(100000 + Math.random() * 800000).toString()
        user.resetpasswordotp = otp
        user.expireresetotp = Date.now() + 30 * 60 * 1000;
        await user.save()

        const sendmail = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Password Reset OTP",
            text: `Hi ${user.name} this is your Password Reset OTP ${otp}. Make sure it will Expire in 30 minutes.`
            
        }
        await transporter.sendMail(sendmail);
        return res.status(200).json({ success: true, message: "Password Reset OTP sent to your email address.", userId: user._id })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}




export const getResetPasswordOtp = async (req, res) => {

    const { userId, otp } = req.body;
    if (!userId || !otp) {
        return res.status(400).json({ success: false, message: "Missing Details !" })
    }

    try {

        const user = await usermodel.findById(userId);
        if (!user) {
            return res.status(401).json({ success: false, message: "Please Register first your self then try again !" })
        }


        if (user.resetpasswordotp !== otp) {
            return res.status(402).json({ success: false, message: "Incorrect OTP!" });
        }




        if (user.expireresetotp < Date.now()) {
            return res.status(403).json({ success: false, message: "Your OTP is Expired ! Please try again." })
        }

        user.resetpasswordotp = null;
        user.expireresetotp = null;
        await user.save();

        return res.status(200).json({ success: true, message: "OTP verified successfully. You can now reset your password." })

    } catch (error) {

        return res.status(500).json({ success: false, message: error.message });
    }
}




export const resetPassword = async (req, res) => {

    const { userId, password, confirmPassword } = req.body;
    if (!userId || !password || !confirmPassword) {
        return res.status(40).json({ success: false, message: "Please provide all the details to reset your password!" })
    }

    try {

        const user = await usermodel.findById(userId );
        if (!user) {
            return res.status(401).json({ success: false, message: "Please Register first your Self !" })
        }

        if (password !== confirmPassword) {
            return res.status(402).json({ success: false, message: "Please Enter same Password to reset your Current Password !" })
        }

        const hash = await bcrypt.hash(confirmPassword, 10)
        const setNewPassword = await usermodel.findOne({
            password: hash
        })


        return res.status(200).json({ success: true, message: "Your password is reset successfully." })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}



