import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Mentorship from '../models/Mentorship.js';
import Notification from '../models/Notification.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const mentorship = await Mentorship.create({ ...req.body, mentee: req.user._id });
    await Notification.create({
      user: req.body.mentor,
      fromUser: req.user._id,
      title: 'Mentorship request',
      message: 'You received a new mentorship request'
    });
    res.status(201).json({ message: 'Mentor request sent', mentorship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const mentorships = await Mentorship.find({ mentor: req.user._id }).populate('mentee', 'name email');
    res.json({ mentorships });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', protect, async (req, res) => {
  try {
    const mentorship = await Mentorship.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    await Notification.create({
      user: mentorship.mentee,
      fromUser: req.user._id,
      title: 'Mentorship response',
      message: `Your mentorship request was ${req.body.status}`
    });
    res.json({ message: `Mentorship request ${req.body.status}`, mentorship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/feedback', protect, async (req, res) => {
  try {
    const mentorship = await Mentorship.findByIdAndUpdate(req.params.id, { feedback: req.body.feedback }, { new: true });
    res.json({ message: 'Feedback submitted', mentorship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
