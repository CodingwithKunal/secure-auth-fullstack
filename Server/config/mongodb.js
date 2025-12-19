import mongoose from "mongoose";
import debug from "debug";


const log = debug("Auth:system"); 

const connectDb = async () =>{
    try {
        
        await mongoose.connect(`${process.env.MONGO_URI}/Full_Auth_Pro`);
        log("MongoDB connected successfully");
        return mongoose;

    } catch (error) {
        
        log("MongoDB connection failed");
        process.exit(1);
    }
}
export default connectDb
