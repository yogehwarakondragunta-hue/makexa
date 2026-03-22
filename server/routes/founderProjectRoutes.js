import express from 'express';
import {
    createFounderProject,
    getAllFounderProjects,
    getProjectsByStartup,
    submitWork,
    getProjectSubmissions,
    updateSubmissionStatus
} from '../controllers/founderProjectController.js';

const router = express.Router();

// Founder posts a project
router.post('/', createFounderProject);

// Get all open projects (job seekers browse)
router.get('/', getAllFounderProjects);

// Get projects by startup (founder dashboard)
router.get('/startup/:startupId', getProjectsByStartup);

// Multer setup for video uploads
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/videos/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'video/mp4') {
            cb(null, true);
        } else {
            cb(new Error('Only MP4 video files are allowed!'), false);
        }
    }
});

// Job seeker submits work for a project
router.post('/:projectId/submit', upload.single('video'), submitWork);

// Founder views submissions for a project
router.get('/:projectId/submissions', getProjectSubmissions);

// Founder accepts/rejects a submission
router.put('/submissions/:submissionId/status', updateSubmissionStatus);

export default router;
