import Project from '../models/Project.js';

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.json({ success: true, count: projects.length, data: projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @route   POST /api/projects
// @desc    Create a new project
// @access  Public
export const createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
