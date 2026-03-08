import User from '../models/User.js';

// @route   GET /api/users
// @desc    Get all users
// @access  Public
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json({ success: true, count: users.length, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @route   POST /api/users
// @desc    Create a new user
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { email, name, password, role } = req.body;

        if (!password) {
            return res.status(400).json({ success: false, message: 'Password is required' });
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        user = await User.create({ name, email, password, role });
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const otps = {}; // In-memory store: email -> otp

// @route   POST /api/users/generate-otp
// @desc    Generate a mock OTP for an email
// @access  Public
export const generateOtp = (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otps[email] = otp;

    console.log(`[Mock Email] OTP for ${email}: ${otp}`);

    // In a real app, send actual email here.
    // We send it back in response for easy testing.
    res.json({ success: true, message: "OTP sent successfully to email", mockOtp: otp });
};

// @route   POST /api/users/verify-otp
// @desc    Verify the generated OTP
// @access  Public
export const verifyOtp = (req, res) => {
    const { email, otp } = req.body;
    if (otps[email] && otps[email] === otp) {
        delete otps[email];
        res.json({ success: true, message: "OTP verified correctly" });
    } else {
        res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }
};
