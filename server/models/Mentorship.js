import mongoose from 'mongoose';

const mentorshipSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  feedback: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Mentorship = mongoose.model('Mentorship', mentorshipSchema);
export default Mentorship;
