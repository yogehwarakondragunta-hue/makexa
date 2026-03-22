import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// import projectRoutes from './routes/projectRoutes.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import startupRoutes from './routes/startupRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import aadharRoutes from './routes/aadharRoutes.js';
import founderProjectRoutes from './routes/founderProjectRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Basic Route
app.get('/', (req, res) => {
    res.send('Makexa API is running...');
});

// API Routes
// app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/startup', startupRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/aadhar', aadharRoutes);
app.use('/api/founder-projects', founderProjectRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
