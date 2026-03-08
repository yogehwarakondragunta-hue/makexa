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
            required: [true, 'Please add a full name']
        },
        email: {
            type: String,
            required: [true, 'Please add an email']
        },
        dob: {
            type: Date,
            required: [true, 'Please add a date of birth']
        },
        aadharPhoto: {
            type: String,
            required: [true, 'Please upload an Aadhar photo']
        },
        startupTitle: {
            type: String,
            required: [true, 'Please add a startup title']
        },
        coreIdea: {
            type: String,
            required: [true, 'Please add a core idea']
        },
        members: {
            type: Number,
            required: [true, 'Please add the number of members']
        },
        sector: {
            type: String,
            required: [true, 'Please add a sector']
        },
        futureVision: {
            type: String,
            required: [true, 'Please add a future vision description']
        },
        mobileNumber: {
            type: String,
            required: [true, 'Please add a mobile number']
        },
        status: {
            type: String,
            enum: ['under validation', 'approved', 'rejected'],
            default: 'under validation'
        }
    },
    {
        timestamps: true
    }
);

const Startup = mongoose.model('Startup', startupSchema);
export default Startup;