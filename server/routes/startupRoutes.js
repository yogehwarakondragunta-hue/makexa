import express from 'express';
import multer from 'multer';
import path from 'path';
import { generateMobileOtp, verifyMobileOtp, createStartupRequest, getStartupProfile, getStartupByFounderId, getAllStartups } from '../controllers/startupController.js';

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/generate-otp', generateMobileOtp);
router.post('/verify-otp', verifyMobileOtp);

// Simplified route without auth middleware for now (will need founderId in body)
router.post('/create', upload.single('aadharPhoto'), createStartupRequest);

// Get all startups
router.get('/', getAllStartups);

// Get startup profile by ID
router.get('/:id', getStartupProfile);

// Get startup profile by Founder ID
router.get('/founder/:founderId', getStartupByFounderId);

export default router;
