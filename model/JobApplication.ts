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
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  
});

export default mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema); 