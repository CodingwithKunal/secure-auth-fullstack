import jwt from 'jsonwebtoken';
import usermodel from '../Models/user.js';



export const isAuthenticated = async (req,res,next) =>{
    const {token} = req.cookies;
    if(!token){
        return res.status(401).json({message: "You are not logged in ! Please login to access this resource."})
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await usermodel.findById(decoded.userId).select('-password');
        
        if(!user){
            return res.status(401).json({message: "User not found please register !"})
        }
        req.user = { _id: decoded.userId };
        next();

    } catch (error) {
        return res.status(500).json({message:error.message});
    }

}