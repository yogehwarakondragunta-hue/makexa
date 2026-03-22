import User from '../models/User.js';
import Startup from '../models/startup.js';
import Submission from '../models/Submission.js';
import Application from '../models/Application.js';
import FounderProject from '../models/FounderProject.js';

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

        // If user is a founder, auto-create a placeholder startup
        if (role === 'founder') {
            await Startup.create({
                founderId: user._id,
                fullName: name,
                email: email,
                startupTitle: `${name}'s Startup`, // Placeholder title
                status: 'under validation'
            });
        }

        res.status(201).json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   POST /api/users/login
// @desc    Authenticate user & get token (mock for now)
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Return user data (in a real app, send a JWT token)
        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: "mock-jwt-token-123"
        });
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

// @route   GET /api/users/:id/dashboard
// @desc    Get job seeker dashboard data (profile, submissions, applications, stats)
// @access  Public
export const getJobSeekerDashboard = async (req, res) => {
    try {
        const userId = req.params.id;

        // Fetch user info
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Fetch all submissions by this seeker, populated with project info
        const submissions = await Submission.find({ seekerId: userId })
            .populate({
                path: 'projectId',
                select: 'title description difficulty status startupId',
                populate: {
                    path: 'startupId',
                    select: 'startupTitle'
                }
            })
            .sort({ createdAt: -1 });

        // Fetch all startup applications by this user
        const applications = await Application.find({ applicantId: userId })
            .populate({
                path: 'startupId',
                select: 'startupTitle sector coreIdea status'
            })
            .sort({ createdAt: -1 });

        // Compute stats
        const stats = {
            totalSubmissions: submissions.length,
            underReview: submissions.filter(s => s.status === 'under review').length,
            accepted: submissions.filter(s => s.status === 'accepted').length,
            rejected: submissions.filter(s => s.status === 'rejected').length,
            totalApplications: applications.length,
            pendingApplications: applications.filter(a => a.status === 'pending').length,
            acceptedApplications: applications.filter(a => a.status === 'accepted').length,
        };

        res.json({
            success: true,
            data: {
                user,
                submissions,
                applications,
                stats
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
