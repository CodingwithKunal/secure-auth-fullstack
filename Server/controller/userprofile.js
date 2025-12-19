import usermodel from "../Models/user.js";
import gravatar  from 'gravatar';


export const profileDetails = async (req,res) => {
    try {

        const userId = req.user?._id  || req.params?.userId;
        if(!userId){
            return res.status(400).json({message:"UserId is missing !"})
        }
        const user = await usermodel.findById(userId).select('-password -resetpasswordotp -expireresetotp -verfiedotp -expireverfyotp -__v');
        if(!user){
            return res.status(400).json({message:"User not found !"})
        }

        
         
        return res.status(200).json({user:{
            name: user.name,
            // email: user.email,
            isvarified: user.isvarified,
            profilepic : user.profilepic , 
        }});
       
        
    } catch (error) {
        return res.status(500).json({message:error.message});
    };
}