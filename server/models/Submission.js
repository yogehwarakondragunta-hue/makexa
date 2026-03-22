import mongoose from 'mongoose';

const submissionSchema = mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FounderProject',
            required: true
        },
        seekerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        githubLink: {
            type: String,
            required: [true, 'GitHub repository link is required']
        },
        videoLink: {
            type: String,
            required: [true, 'Explanation video link is required']
        },
        description: {
            type: String,
            required: false
        },
        status: {
            type: String,
            enum: ['under review', 'accepted', 'rejected'],
            default: 'under review'
        }
    },
    {
        timestamps: true
    }
);

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
