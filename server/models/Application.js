import mongoose from 'mongoose';

const applicationSchema = mongoose.Schema(
    {
        applicantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        startupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Startup',
            required: true
        },
        roleAppliedFor: {
            type: String,
            required: true
        },
        coverLetter: {
            type: String,
            required: false // Optional
        },
        resumeLink: {
            type: String,
            required: false // Optional
        },
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'accepted', 'rejected'],
            default: 'pending' // Only the Founder can change this to 'accepted'
        }
    },
    {
        timestamps: true
    }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
