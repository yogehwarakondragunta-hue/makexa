import mongoose from 'mongoose';

const projectSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title']
        },
        description: {
            type: String,
            required: [true, 'Please add a description']
        },
        sector: {
            type: String,
            required: [true, 'Please add a sector']
        },
        founder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false // Optional for now
        },
        techStack: {
            type: [String],
            default: []
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        status: {
            type: String,
            enum: ['Idea Phase', 'Looking for Co-founders', 'In Development', 'Launched'],
            default: 'Idea Phase'
        }
    },
    {
        timestamps: true
    }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
