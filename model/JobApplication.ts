import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema({
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FreelancerProfile',
    required: true,
  },
  appliedAt: {
    type: Date,
    required: true,
  },
  coverLetter: {
    type: String,
    required: true,
  },
  proposedAmount: {
    type: Number,
    required: true,
  },
  estimatedDuration: {
    type: String,
    required: true,
  },
});

export default mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema); 