import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log("DB connected successfuly!");
    } catch (error) {
        console.log("error connecting to mongo DB", error);
        process.exit(1); 
    }
};

