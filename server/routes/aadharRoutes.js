import express from 'express';
import { verifyAadhaar, seedAadhaar } from '../controllers/aadharController.js';

const router = express.Router();

// POST /api/aadhar/verify - Verify Aadhaar number against the database
router.post('/verify', verifyAadhaar);

// POST /api/aadhar/seed - Seed sample Aadhaar records (DEV ONLY)
router.post('/seed', seedAadhaar);

export default router;
