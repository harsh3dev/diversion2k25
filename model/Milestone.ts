import mongoose from 'mongoose';

const MilestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  completedDate: {
    type: Date,
  },
  deliverables: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deliverable',
  }],
});

export default mongoose.models.Milestone || mongoose.model('Milestone', MilestoneSchema); 