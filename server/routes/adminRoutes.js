import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Startup from '../models/Startup.js';
import Category from '../models/Category.js';
import Application from '../models/Application.js';
import ContactMessage from '../models/ContactMessage.js';

const router = express.Router();

// Middleware to protect admin routes
const adminProtect = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin role required' });
  }
};

// Apply admin protect to all routes below
router.use(protect, adminProtect);

// GET /api/admin/dashboard - Stats & Charts
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFounders = await User.countDocuments({ role: 'founder' });
    const totalTeamMembers = await User.countDocuments({ role: 'member' });
    const totalMentors = await User.countDocuments({ role: 'mentor' });

    const totalStartups = await Startup.countDocuments();
    const activeStartups = await Startup.countDocuments({ status: 'open' });
    const closedStartups = await Startup.countDocuments({ status: 'closed' });

    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const totalContactMessages = await ContactMessage.countDocuments();

    // Chart data for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const getMonthlyStats = async (Model) => {
      return await Model.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
    };

    const usersChart = await getMonthlyStats(User);
    const startupsChart = await getMonthlyStats(Startup);
    const contactsChart = await getMonthlyStats(ContactMessage);

    res.json({
      totals: {
        users: totalUsers,
        founders: totalFounders,
        teamMembers: totalTeamMembers,
        mentors: totalMentors,
        startups: totalStartups,
        activeStartups,
        closedStartups,
        pendingApplications,
        contactMessages: totalContactMessages
      },
      charts: {
        users: usersChart,
        startups: startupsChart,
        contacts: contactsChart
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/users - User management with startup counts
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();
    const usersWithCounts = await Promise.all(users.map(async (u) => {
      const createdCount = await Startup.countDocuments({ founder: u._id });
      const joinedCount = await Startup.countDocuments({ teamMembers: u._id });
      return {
        ...u,
        startupsCreated: createdCount,
        startupsJoined: joinedCount
      };
    }));
    res.json({ users: usersWithCounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/admin/users/:id - Delete a user and clean up dependencies
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admin users cannot be deleted' });
    }

    // Delete
    await User.findByIdAndDelete(userId);
    // Cleanup startups founded by them
    await Startup.deleteMany({ founder: userId });
    // Pull from team members
    await Startup.updateMany({}, { $pull: { teamMembers: userId } });
    // Cleanup applications
    await Application.deleteMany({ applicant: userId });

    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/startups - Startup management
router.get('/startups', async (req, res) => {
  try {
    const startups = await Startup.find()
      .populate('founder', 'name email')
      .populate('category');
    res.json({ startups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/admin/startups/:id - Delete a startup
router.delete('/startups/:id', async (req, res) => {
  try {
    const startup = await Startup.findByIdAndDelete(req.params.id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }
    // Cleanup applications
    await Application.deleteMany({ startup: req.params.id });

    res.json({ message: 'Startup deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/contacts - Contact messages
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ contacts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/admin/contacts/:id/read - Mark contact as read
router.put('/contacts/:id/read', async (req, res) => {
  try {
    const contact = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message marked as read', contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/admin/contacts/:id/reply - Reply to contact
router.post('/contacts/:id/reply', async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ message: 'Reply message is required' });

    const contact = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { reply, status: 'replied' },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Reply sent successfully', contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/admin/contacts/:id - Delete message
router.delete('/contacts/:id', async (req, res) => {
  try {
    const contact = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
