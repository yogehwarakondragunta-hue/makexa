import mongoose from 'mongoose';

const aadhaarSchema = mongoose.Schema(
    {
        aadharNumber: {
            type: String,
            required: [true, 'Aadhaar number is required'],
            unique: true,
            minlength: 12,
            maxlength: 12,
            trim: true
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        dob: {
            type: Date,
            required: false
        },
        verified: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Aadhaar = mongoose.model('Aadhaar', aadhaarSchema);
export default Aadhaar;
