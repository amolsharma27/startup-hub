import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Application from '../models/Application.js';
import Startup from '../models/Startup.js';
import Notification from '../models/Notification.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const application = await Application.create({ ...req.body, applicant: req.user._id });
    const startup = await Startup.findById(req.body.startup);
    if (startup) {
      await Notification.create({
        user: startup.founder,
        fromUser: req.user._id,
        title: 'New application',
        message: `A new application was submitted for ${startup.name}`,
        applicationId: application._id,
        type: 'application'
      });
    }
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/startup/:startupId', protect, async (req, res) => {
  try {
    const applications = await Application.find({ startup: req.params.startupId }).populate('applicant', 'name email profilePhoto');
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', protect, async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    const startup = await Startup.findById(application.startup);

    if (startup) {
      // If accepted, add applicant to team members
      if (req.body.status === 'accepted') {
        if (!startup.teamMembers.includes(application.applicant)) {
          startup.teamMembers.push(application.applicant);
          await startup.save();
        }
      }

      await Notification.create({
        user: application.applicant,
        fromUser: req.user._id,
        title: 'Application update',
        message: `Your application for ${startup.name} was ${req.body.status}`
      });
    }
    res.json({ message: `Application ${req.body.status}`, application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
