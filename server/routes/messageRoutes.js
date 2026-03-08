import express from 'express';
import { sendMessage, getConversation } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', sendMessage);
router.get('/:user1/:user2', getConversation);

export default router;
