import express from 'express';
import {
    applyForStartup,
    getStartupApplications,
    updateApplicationStatus
} from '../controllers/applicationController.js';

const router = express.Router();

// Apply to a startup
router.post('/apply', applyForStartup);

// Fetch all applications for a specific startup (Founder View)
router.get('/startup/:startupId', getStartupApplications);

// Update status of an application (Accept/Reject)
router.put('/:id/status', updateApplicationStatus);

export default router;
