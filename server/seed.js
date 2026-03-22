import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Startup from './models/startup.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected...`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing test data to avoid duplicates (Optional but good practice)
        // await Startup.deleteMany();
        // await User.deleteMany();

        console.log("Creating dummy Founder User...");

        // 1. Create a User who will act as the Founder
        const founderUser = await User.create({
            name: "John Doe",
            email: "john.doe.founder@example.com",
            password: "hashedpassword123", // Note: In a real app this would be hashed
            role: "founder"
        });

        console.log("Founder User created with ID:", founderUser._id.toString());

        console.log("Creating dummy Startup Profile...");

        // 2. Create the Startup linked to this Founder
        const startupProfile = await Startup.create({
            founderId: founderUser._id,
            fullName: "John Doe",
            email: "john.doe.founder@example.com",
            dob: new Date("1990-01-01"),
            aadharPhoto: "uploads/dummy_aadhar.jpg", // Fake path for testing
            startupTitle: "TechNova Solutions",
            coreIdea: "An AI-powered platform for sustainable agriculture.",
            members: 3,
            sector: "AgriTech",
            futureVision: "To revolutionize farming by providing real-time data analytics to local farmers worldwide.",
            mobileNumber: "9876543210",
            status: "approved"
        });

        console.log("\n==================================");
        console.log("✅ DUMMY DATA CREATED SUCCESSFULLY!");
        console.log("==================================\n");
        console.log("📌 Important IDs for Testing:");
        console.log(`Startup ID: ${startupProfile._id.toString()}`);
        console.log(`Founder User ID: ${founderUser._id.toString()}`);
        console.log("\nUse the Startup ID in your Frontend URL like this:");
        console.log(`http://localhost:5173/profile/${startupProfile._id.toString()}`);
        console.log("==================================\n");

        process.exit(0);
    } catch (error) {
        console.error("Failed to seed data:", error);
        process.exit(1);
    }
};

seedData();
