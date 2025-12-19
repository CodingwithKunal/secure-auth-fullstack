import express from 'express';
import { createUser , enterVerfication ,getResetPasswordOtp,loginUser, logoutUser, resendOtp,  resetPassword, sendResetPasswordOtp } from '../controller/authController.js';
const router = express.Router();


router.post('/register', createUser);
router.post('/verification', enterVerfication);
router.post('/resendOTP', resendOtp);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/forgotPass', sendResetPasswordOtp);
router.post('/getOtp', getResetPasswordOtp);
router.post('/resetPassword',resetPassword)


export default router;