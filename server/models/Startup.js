import mongoose from 'mongoose';

const startupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  founder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requiredSkills: [{ type: String }],
  status: { type: String, enum: ['draft', 'open', 'closed'], default: 'open' },
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  logo: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Startup = mongoose.model('Startup', startupSchema);
export default Startup;
