import Application from '../models/Application.js';
import Startup from '../models/startup.js';
import User from '../models/User.js';

// @route   POST /api/application/apply
// @desc    Job Seeker applies to a Startup
// @access  Private (Needs auth token - simulate with body for now)
export const applyForStartup = async (req, res) => {
    try {
        const { applicantId, startupId, roleAppliedFor, coverLetter, resumeLink } = req.body;

        if (!applicantId || !startupId || !roleAppliedFor) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Check if startup exists
        const startup = await Startup.findById(startupId);
        if (!startup) {
            return res.status(404).json({ success: false, message: 'Startup not found' });
        }

        // Check if user already applied
        const existingApplication = await Application.findOne({ applicantId, startupId });
        if (existingApplication) {
            return res.status(400).json({ success: false, message: 'You have already applied to this startup' });
        }

        const newApplication = await Application.create({
            applicantId,
            startupId,
            roleAppliedFor,
            coverLetter,
            resumeLink,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: newApplication
        });

    } catch (error) {
        console.error("Apply Error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   GET /api/application/startup/:startupId
// @desc    Get all applications for a specific startup (For Founders)
// @access  Private 
export const getStartupApplications = async (req, res) => {
    try {
        const { startupId } = req.params;

        const applications = await Application.find({ startupId })
            .populate('applicantId', 'name email role') // Bring in applicant details
            .sort({ createdAt: -1 });

        res.json({ success: true, count: applications.length, data: applications });

    } catch (error) {
        console.error("Fetch Applications Error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   PUT /api/application/:id/status
// @desc    Update application status (Accept/Reject)
// @access  Private (Only Founder should do this)
export const updateApplicationStatus = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { status, founderId } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status update' });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // Optional: Verify that the given founderId actually owns this startup
        const startup = await Startup.findById(application.startupId);
        if (!startup) {
            return res.status(404).json({ success: false, message: 'Associated startup not found' });
        }

        if (startup.founderId.toString() !== founderId) {
            return res.status(403).json({ success: false, message: 'Unauthorized: Only the founder can update this application' });
        }

        // Update application
        application.status = status;
        await application.save();

        // If accepted, add applicant to startup's selectedMembers
        if (status === 'accepted') {
            // Check if they are already in the array
            if (!startup.selectedMembers.includes(application.applicantId)) {
                startup.selectedMembers.push(application.applicantId);
                await startup.save();
            }
        }

        res.json({
            success: true,
            message: `Application ${status}`,
            data: application
        });

    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
