import mongoose from 'mongoose';
import Startup from './server/models/startup.js';

mongoose.connect('mongodb://127.0.0.1:27017/makexa')
    .then(async () => {
        try {
            const startups = await Startup.find().limit(2);
            console.log("Startup Profiles:");
            console.log(JSON.stringify(startups, null, 2));
        } catch (err) {
            console.error("Error querying startups mapping:", err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(console.error);
