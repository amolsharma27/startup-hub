import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Task from '../models/Task.js';
import Notification from '../models/Notification.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, assignedBy: req.user._id });
    await Notification.create({
      user: req.body.assignedTo,
      fromUser: req.user._id,
      title: 'Task assigned',
      message: `You were assigned a new task: ${req.body.title}`
    });
    res.status(201).json({ message: 'Task assigned successfully', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).populate('startup', 'name');
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', protect, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ message: 'Task status updated', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
