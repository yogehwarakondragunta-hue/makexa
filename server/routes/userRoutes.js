import express from 'express';
import { getUsers, registerUser, generateOtp, verifyOtp } from '../controllers/userController.js';

const router = express.Router();

router.route('/')
    .get(getUsers)
    .post(registerUser);

router.post('/generate-otp', generateOtp);
router.post('/verify-otp', verifyOtp);

export default router;
