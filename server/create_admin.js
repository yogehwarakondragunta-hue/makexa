import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Startup from './models/startup.js';

dotenv.config();

const createAdmin = async () => {
    try {
        const args = process.argv.slice(2);
        if (args.length !== 2) {
            console.error('Usage: node create_admin.js <email> <password>');
            process.exit(1);
        }

        const [email, password] = args;

        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/makexa');
        console.log('Connected to MongoDB');

        // Check if admin already exists
        let user = await User.findOne({ email });
        if (user) {
            console.log('User with this email already exists.');
        } else {
            // Create Admin User
            user = await User.create({
                name: 'Admin User',
                email,
                password, // Storing in plain text as per current implementation (ideally should be hashed)
                role: 'admin'
            });
            console.log(`Admin user created: ${user.email}`);
        }

        // Create a placeholder startup for the admin so they can post projects
        let startup = await Startup.findOne({ founderId: user._id });
        if (!startup) {
            startup = await Startup.create({
                founderId: user._id,
                fullName: user.name,
                email: user.email,
                startupTitle: `Makexa Admin Startup`,
                status: 'approved' // Auto-validate the admin
            });
            console.log(`Admin placeholder startup created: ${startup.startupTitle}`);
        } else {
            console.log(`Admin placeholder startup already exists: ${startup.startupTitle}`);
        }

        console.log('\nSuccess! You can now log into Makexa with these credentials.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
