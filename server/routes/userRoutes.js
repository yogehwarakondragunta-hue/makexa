import express from 'express';
import { getUsers, registerUser, generateOtp, verifyOtp, loginUser, getJobSeekerDashboard } from '../controllers/userController.js';

const router = express.Router();

router.route('/')
    .get(getUsers)
    .post(registerUser);

router.post('/generate-otp', generateOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser);
router.get('/:id/dashboard', getJobSeekerDashboard);

export default router;
