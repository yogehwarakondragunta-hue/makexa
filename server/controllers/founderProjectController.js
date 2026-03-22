import FounderProject from '../models/FounderProject.js';
import Submission from '../models/Submission.js';
import Startup from '../models/startup.js';

// @route   POST /api/founder-projects
// @desc    Founder posts a new project for job seekers
// @access  Private (simulated with founderId in body)
export const createFounderProject = async (req, res) => {
    try {
        const { founderId, startupId, title, description, requiredSkills, difficulty, deadline } = req.body;

        if (!founderId || !startupId || !title || !description) {
            return res.status(400).json({ success: false, message: 'Missing required fields: founderId, startupId, title, description' });
        }

        // Verify startup exists and belongs to this founder
        const startup = await Startup.findById(startupId);
        if (!startup) {
            return res.status(404).json({ success: false, message: 'Startup not found' });
        }
        if (startup.founderId.toString() !== founderId) {
            return res.status(403).json({ success: false, message: 'You can only post projects for your own startup' });
        }

        const project = await FounderProject.create({
            founderId,
            startupId,
            title,
            description,
            requiredSkills: requiredSkills || [],
            difficulty: difficulty || 'Medium',
            deadline: deadline || null,
            status: 'open'
        });

        res.status(201).json({
            success: true,
            message: 'Project posted successfully! Job seekers can now see it.',
            data: project
        });
    } catch (error) {
        console.error("Create Founder Project Error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   GET /api/founder-projects
// @desc    Get all open projects (for job seekers to browse)
// @access  Public
export const getAllFounderProjects = async (req, res) => {
    try {
        const projects = await FounderProject.find({ status: 'open' })
            .populate('founderId', 'name email')
            .populate('startupId', 'startupTitle sector coreIdea')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: projects.length, data: projects });
    } catch (error) {
        console.error("Get All Founder Projects Error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   GET /api/founder-projects/startup/:startupId
// @desc    Get all projects posted by a specific startup (for founder dashboard)
// @access  Public
export const getProjectsByStartup = async (req, res) => {
    try {
        const { startupId } = req.params;
        const projects = await FounderProject.find({ startupId })
            .populate('founderId', 'name email')
            .sort({ createdAt: -1 });

        // For each project, also get submission count
        const projectsWithCounts = await Promise.all(
            projects.map(async (project) => {
                const submissionCount = await Submission.countDocuments({ projectId: project._id });
                return { ...project.toObject(), submissionCount };
            })
        );

        res.json({ success: true, count: projectsWithCounts.length, data: projectsWithCounts });
    } catch (error) {
        console.error("Get Projects by Startup Error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   POST /api/founder-projects/:projectId/submit
// @desc    Job seeker submits their work (GitHub link + video link both required)
// @access  Private (simulated with seekerId in body)
export const submitWork = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { seekerId, githubLink, description } = req.body;

        if (!seekerId || !githubLink || !req.file) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: seekerId, githubLink, and a video file'
            });
        }

        const videoLink = `/uploads/videos/${req.file.filename}`;

        // Verify project exists and is open
        const project = await FounderProject.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        if (project.status !== 'open') {
            return res.status(400).json({ success: false, message: 'This project is no longer accepting submissions' });
        }

        // Check if this seeker already submitted for this project
        const existingSubmission = await Submission.findOne({ projectId, seekerId });
        if (existingSubmission) {
            return res.status(400).json({ success: false, message: 'You have already submitted work for this project' });
        }

        const submission = await Submission.create({
            projectId,
            seekerId,
            githubLink,
            videoLink,
            description: description || '',
            status: 'under review'
        });

        res.status(201).json({
            success: true,
            message: 'Your project is under review!',
            data: submission
        });
    } catch (error) {
        console.error("Submit Work Error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   GET /api/founder-projects/:projectId/submissions
// @desc    Get all submissions for a specific project (for founder to review)
// @access  Private (founder only)
export const getProjectSubmissions = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await FounderProject.findById(projectId)
            .populate('founderId', 'name email')
            .populate('startupId', 'startupTitle');

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        const submissions = await Submission.find({ projectId })
            .populate('seekerId', 'name email role')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            project,
            count: submissions.length,
            data: submissions
        });
    } catch (error) {
        console.error("Get Submissions Error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   PUT /api/founder-projects/submissions/:submissionId/status
// @desc    Founder accepts or rejects a submission
// @access  Private (founder only)
export const updateSubmissionStatus = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { status, founderId } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status must be accepted or rejected' });
        }

        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ success: false, message: 'Submission not found' });
        }

        // Verify this founder owns the project
        const project = await FounderProject.findById(submission.projectId);
        if (!project || project.founderId.toString() !== founderId) {
            return res.status(403).json({ success: false, message: 'Unauthorized: Only the project founder can review submissions' });
        }

        submission.status = status;
        await submission.save();

        res.json({
            success: true,
            message: `Submission ${status}`,
            data: submission
        });
    } catch (error) {
        console.error("Update Submission Status Error:", error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
