import Message from '../models/Message.js';
import User from '../models/User.js';

// @route   POST /api/messages
// @desc    Send a message
// @access  Public
export const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;

        if (!senderId || !receiverId || !content) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const message = await Message.create({
            sender: senderId,
            receiver: receiverId,
            content: content
        });

        res.status(201).json({ success: true, data: message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @route   GET /api/messages/:user1/:user2
// @desc    Get conversation between two users
// @access  Public
export const getConversation = async (req, res) => {
    try {
        const { user1, user2 } = req.params;

        // Find messages where sender is user1 & receiver is user2 AND vice-versa
        const messages = await Message.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }
            ]
        }).sort({ createdAt: 1 }); // Oldest first for chat UI

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
