import mongoose from 'mongoose';

const MilestoneSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const JobSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Smart Contracts', 'DApp Development', 'Web3 Integration', 'Blockchain Infrastructure', 'NFT Development'],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  milestones: [MilestoneSchema],
  estimatedHours: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Past Work', 'Disputed Work'],
    default: 'Not Started',
  },
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);
