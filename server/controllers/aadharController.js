import Aadhaar from '../models/Aadhaar.js';

// @route   POST /api/aadhar/verify
// @desc    Verify if an Aadhaar number exists in the database
// @access  Public
export const verifyAadhaar = async (req, res) => {
    try {
        const { aadharNumber } = req.body;

        if (!aadharNumber) {
            return res.status(400).json({ success: false, message: 'Aadhaar number is required' });
        }

        if (aadharNumber.length !== 12 || !/^\d{12}$/.test(aadharNumber)) {
            return res.status(400).json({ success: false, message: 'Aadhaar number must be exactly 12 digits' });
        }

        const record = await Aadhaar.findOne({ aadharNumber, verified: true });

        if (!record) {
            return res.status(404).json({ success: false, message: 'Aadhaar number not found in our records' });
        }

        res.json({
            success: true,
            message: 'Aadhaar verified successfully',
            data: {
                name: record.name,
                dob: record.dob
            }
        });

    } catch (error) {
        console.error('Aadhaar Verify Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   POST /api/aadhar/seed
// @desc    Seed sample Aadhaar records (DEV ONLY)
// @access  Public (dev only)
export const seedAadhaar = async (req, res) => {
    try {
        const sampleRecords = [
            { aadharNumber: '123456789012', name: 'Ravi Kumar', dob: new Date('1990-05-15'), verified: true },
            { aadharNumber: '234567890123', name: 'Priya Sharma', dob: new Date('1995-08-22'), verified: true },
            { aadharNumber: '345678901234', name: 'Arjun Mehta', dob: new Date('1988-11-30'), verified: true },
            { aadharNumber: '456789012345', name: 'Sneha Reddy', dob: new Date('1993-03-10'), verified: true },
            { aadharNumber: '567890123456', name: 'Vikram Nair', dob: new Date('1985-07-01'), verified: true },
        ];

        // Use upsert so seeding is idempotent (safe to run multiple times)
        for (const record of sampleRecords) {
            await Aadhaar.findOneAndUpdate(
                { aadharNumber: record.aadharNumber },
                record,
                { upsert: true, new: true }
            );
        }

        res.json({
            success: true,
            message: `${sampleRecords.length} Aadhaar records seeded successfully`,
            data: sampleRecords.map(r => ({ aadharNumber: r.aadharNumber, name: r.name }))
        });

    } catch (error) {
        console.error('Aadhaar Seed Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
