import Startup from '../models/startup.js';
import Aadhaar from '../models/Aadhaar.js';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const mobileOtps = {}; // In-memory store: mobileNumber -> otp

// Twilio Setup (Optional, will fall back to mock if not configured)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

// @route   POST /api/startup/generate-otp
// @desc    Generate a mock OTP for a mobile number
// @access  Public
export const generateMobileOtp = async (req, res) => {
    const { mobileNumber } = req.body;
    if (!mobileNumber) return res.status(400).json({ success: false, message: "Mobile number required" });

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    mobileOtps[mobileNumber] = otp;

    console.log(`[Mock SMS] OTP for ${mobileNumber}: ${otp}`);

    if (twilioClient) {
        try {
            await twilioClient.messages.create({
                body: `Your Makexa verification code is: ${otp}`,
                from: twilioNumber,
                to: mobileNumber
            });
            console.log("Sent Twilio SMS successfully.");
        } catch (error) {
            console.error("Failed to send Twilio SMS:", error.message);
            // We ignore Twilio errors for dev tests to not block flow
        }
    }

    res.json({ success: true, message: "OTP sent successfully to mobile", mockOtp: otp });
};

// @route   POST /api/startup/verify-otp
// @desc    Verify the generated mock mobile OTP
// @access  Public
export const verifyMobileOtp = (req, res) => {
    const { mobileNumber, otp } = req.body;
    if (mobileOtps[mobileNumber] && mobileOtps[mobileNumber] === otp) {
        delete mobileOtps[mobileNumber];
        res.json({ success: true, message: "OTP verified correctly" });
    } else {
        res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }
};

// @route   POST /api/startup/create
// @desc    Create a new startup idea
// @access  Private (Needs auth token)
export const createStartupRequest = async (req, res) => {
    try {
        let {
            fullName,
            email,
            dob,
            startupTitle,
            coreIdea,
            members,
            sector,
            futureVision,
            mobileNumber,
            aadharNumber,
        } = req.body;

        const aadharPhoto = req.file ? req.file.path : null;

        // We assume frontend sends founderId for now because there is no auth middleware
        const founderId = req.body.founderId;

        if (!founderId) {
            return res.status(400).json({ success: false, message: "Founder ID is required" });
        }

        // Fetch user details if not provided
        if (!fullName || !email) {
            const User = (await import('../models/User.js')).default;
            const user = await User.findById(founderId);
            if (user) {
                fullName = fullName || user.name;
                email = email || user.email;
            }
        }

        const newStartup = await Startup.create({
            founderId,
            fullName,
            email,
            dob,
            aadharPhoto,
            startupTitle,
            coreIdea,
            members,
            sector,
            futureVision,
            mobileNumber,
            status: 'under validation'
        });

        res.status(201).json({
            success: true,
            message: "Your idea is under validation!",
            data: newStartup
        });
    } catch (error) {
        console.error("Create Startup Error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   GET /api/startup/:id
// @desc    Get startup profile by ID
// @access  Public
export const getStartupProfile = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if id is a valid mongoose ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid Startup ID format' });
        }

        const startup = await Startup.findById(id);

        if (!startup) {
            return res.status(404).json({ success: false, message: 'Startup not found' });
        }

        res.json({ success: true, data: startup });
    } catch (error) {
        console.error("Get Startup Error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   GET /api/startup/founder/:founderId
// @desc    Get startup profile by founder ID
// @access  Public (should eventually be private)
export const getStartupByFounderId = async (req, res) => {
    try {
        const { founderId } = req.params;

        // Check if founderId is a valid mongoose ObjectId
        if (!founderId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Invalid Founder ID format' });
        }

        const startup = await Startup.findOne({ founderId });

        if (!startup) {
            return res.status(404).json({ success: false, message: 'No startup found for this founder' });
        }

        res.json({ success: true, data: startup });
    } catch (error) {
        console.error("Get Startup by Founder Error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   GET /api/startup
// @desc    Get all startups
// @access  Public
export const getAllStartups = async (req, res) => {
    try {
        const startups = await Startup.find();
        res.json({ success: true, count: startups.length, data: startups });
    } catch (error) {
        console.error("Get All Startups Error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
