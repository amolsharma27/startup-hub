import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Message from '../models/Message.js';

const router = express.Router();

// GET /api/messages/:startupId - fetch chat history for a team, oldest first
router.get('/:startupId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ startup: req.params.startupId })
      .populate('sender', 'name profilePhoto')
      .sort({ createdAt: 1 });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
