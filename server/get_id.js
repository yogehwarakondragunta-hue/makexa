import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Startup from './models/startup.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const startup = await Startup.findOne({ startupTitle: "TechNova Solutions" });
        if (startup) {
            console.log("\n==================================");
            console.log("STARTUP FOUND!");
            console.log(`Startup ID: ${startup._id.toString()}`);
            console.log(`URL to test: http://localhost:5173/profile/${startup._id.toString()}`);
            console.log("==================================\n");
        } else {
            console.log("Startup not found.");
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

connectDB();
