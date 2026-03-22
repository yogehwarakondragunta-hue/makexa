import mongoose from 'mongoose';

const startupSchema = mongoose.Schema(
    {
        founderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        fullName: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        dob: {
            type: Date,
            required: false
        },
        aadharPhoto: {
            type: String,
            required: false
        },
        startupTitle: {
            type: String,
            required: false
        },
        coreIdea: {
            type: String,
            required: false
        },
        members: {
            type: Number,
            required: false
        },
        sector: {
            type: String,
            required: false
        },
        futureVision: {
            type: String,
            required: false
        },
        mobileNumber: {
            type: String,
            required: false
        },
        status: {
            type: String,
            enum: ['under validation', 'approved', 'rejected'],
            default: 'under validation'
        },
        selectedMembers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    {
        timestamps: true
    }
);

const Startup = mongoose.model('Startup', startupSchema);
export default Startup;