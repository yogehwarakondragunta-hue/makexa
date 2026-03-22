import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name']
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Please add a password']
        },
        role: {
            type: String,
            enum: ['founder', 'developer', 'designer', 'Job Seeker', 'Startup Handler', 'admin'],
            default: 'Job Seeker'
        },

        wishlist: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        startups: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        }]
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);
export default User;
