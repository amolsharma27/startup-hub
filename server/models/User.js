import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['founder', 'member', 'mentor', 'admin'], default: 'member' },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  education: { type: String, default: '' },
  experience: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  profilePhoto: { type: String, default: '' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
