import mongoose from "mongoose";

import { DB_URI, NODE_ENV } from "../config/env.js";

if(!DB_URI) {
    console.error("MongoDB connection string is not defined in environment variables.");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to MongoDB database in ${NODE_ENV} mode`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;