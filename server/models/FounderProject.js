import mongoose from 'mongoose';

const founderProjectSchema = mongoose.Schema(
    {
        startupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Startup',
            required: true
        },
        founderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: [true, 'Please add a project title']
        },
        description: {
            type: String,
            required: [true, 'Please add a project description']
        },
        requiredSkills: {
            type: [String],
            default: []
        },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            default: 'Medium'
        },
        deadline: {
            type: Date,
            required: false
        },
        status: {
            type: String,
            enum: ['open', 'closed'],
            default: 'open'
        }
    },
    {
        timestamps: true
    }
);

const FounderProject = mongoose.model('FounderProject', founderProjectSchema);
export default FounderProject;
