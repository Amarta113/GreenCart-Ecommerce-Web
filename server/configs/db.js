import mongoose from "mongoose";

const connectDB = async() => {
    try{
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log("Database already connected");
            return;
        }

        mongoose.connection.on('connected', () => console.log("Database connected"))
        mongoose.connection.on('error', (err) => console.error("Database connection error:", err))
        mongoose.connection.on('disconnected', () => console.log("Database disconnected"))
        
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not set");
        }
        
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database connection established");
    } catch (error) {
        console.error("Database connection failed:", error.message)
        throw error; // Re-throw to handle in calling function
    }    
}

export default connectDB;