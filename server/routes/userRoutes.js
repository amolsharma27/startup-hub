import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Startup from '../models/Startup.js';
import Notification from '../models/Notification.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${Date.now()}_${cleanName}${ext}`);
  }
});

const upload = multer({ storage });

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('followers', 'name profilePhoto')
      .populate('following', 'name profilePhoto');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users/role/mentor - get all users with role 'mentor'
router.get('/role/mentor', protect, async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('name profilePhoto bio');
    res.json({ mentors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users/connections/all - get all connected users
router.get('/connections/all', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followers', 'name profilePhoto bio')
      .populate('following', 'name profilePhoto bio');
    
    const map = new Map();
    if (user.followers) user.followers.forEach(u => map.set(u._id.toString(), u));
    if (user.following) user.following.forEach(u => map.set(u._id.toString(), u));
    
    const connections = Array.from(map.values());
    res.json({ connections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users - get all community profiles
router.get('/', protect, async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = { isActive: { $ne: false } };
    if (role && role !== 'all') {
      filter.role = role;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }
    const users = await User.find(filter)
      .select('-password -email')
      .populate('followers', 'name profilePhoto')
      .populate('following', 'name profilePhoto')
      .sort({ createdAt: -1 });

    const usersWithStartups = await Promise.all(
      users.map(async (u) => {
        const userObj = u.toObject();
        const startups = await Startup.find({
          $or: [
            { founder: u._id },
            { teamMembers: u._id }
          ]
        }).populate('category', 'name').select('name logo category status');
        userObj.startups = startups;
        userObj.startupsCount = startups.length;
        return userObj;
      })
    );

    res.json({ users: usersWithStartups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users/:id - view another user's public profile (no password/email exposed)
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email')
      .populate('followers', 'name profilePhoto')
      .populate('following', 'name profilePhoto');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const startups = await Startup.find({
      $or: [
        { founder: user._id },
        { teamMembers: user._id }
      ]
    }).populate('category');

    res.json({ user, startups, startupsCount: startups.length, startup: startups[0] || null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users/:id/connect - follow/unfollow a user
router.post('/:id/connect', protect, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser._id.equals(currentUser._id)) {
      return res.status(400).json({ message: 'You cannot connect with yourself' });
    }

    const isFollowing = currentUser.following.some(id => id.equals(targetUser._id));

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(id => !id.equals(targetUser._id));
      targetUser.followers = targetUser.followers.filter(id => !id.equals(currentUser._id));
      await currentUser.save();
      await targetUser.save();
      return res.json({ message: `Disconnected from ${targetUser.name}`, isConnected: false });
    } else {
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
      await currentUser.save();
      await targetUser.save();

      // Create notification
      await Notification.create({
        user: targetUser._id,
        fromUser: currentUser._id,
        title: 'New Connection',
        message: `${currentUser.name} connected with you`
      });

      return res.json({ message: `Connected with ${targetUser.name}`, isConnected: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select('-password');
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/upload-photo', protect, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByIdAndUpdate(req.user._id, { profilePhoto: `/uploads/${req.file.filename}` }, { new: true }).select('-password');
    res.json({ message: 'File uploaded successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
