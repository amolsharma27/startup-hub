import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Startup from '../models/Startup.js';
import Category from '../models/Category.js';
import { notifyAdmins } from '../utils/adminNotification.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const startups = await Startup.find()
      .populate('founder', 'name role profilePhoto')
      .populate('teamMembers', 'name role profilePhoto')
      .populate('category');
    res.json({ startups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { name, description, category, requiredSkills } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }
    const payload = {
      name,
      description,
      founder: req.user._id,
      requiredSkills: requiredSkills || []
    };
    // Only set category if it's a valid non-empty string
    if (category && category.trim() !== '') {
      // Verify the category exists
      const catExists = await Category.findById(category);
      if (catExists) {
        payload.category = category;
      }
    }
    const startup = await Startup.create(payload);
    const populated = await Startup.findById(startup._id).populate('founder', 'name role').populate('category');

    // Notify admins
    await notifyAdmins({
      fromUser: req.user._id,
      title: 'New Startup Created',
      message: `A new startup "${name}" has been created by ${req.user.name}.`
    });

    res.status(201).json({ message: 'Startup created successfully', startup: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)
      .populate('founder', 'name role profilePhoto')
      .populate('teamMembers', 'name role profilePhoto')
      .populate('category');
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    res.json({ startup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const { category, ...rest } = req.body;
    const updateData = { ...rest };
    if (category && category.trim() !== '') {
      const catExists = await Category.findById(category);
      if (catExists) updateData.category = category;
    } else {
      updateData.category = null;
    }
    const startup = await Startup.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('founder', 'name role')
      .populate('category');
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    res.json({ message: 'Startup updated successfully', startup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const startup = await Startup.findByIdAndDelete(req.params.id);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    res.json({ message: 'Startup deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/categories', protect, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/categories/all', async (_req, res) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
