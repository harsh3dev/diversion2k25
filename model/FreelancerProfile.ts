import mongoose from 'mongoose';

const FreelancerProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  trustTokens: {
    type: Number,
  },
  about: {
    type: String,
  },
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
  }],
  completedJobs: {
    type: Number,
  },
  successRate: {
    type: Number,
  },
  location: {
    type: String,
  },
  hourlyRate: {
    type: Number,
  },
  languages: [{
    type: String,
  }],
  githubUrl: {
    type: String,
  },
  linkedinUrl: {
    type: String,
  },
  walletaddress: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.models.FreelancerProfile || mongoose.model('FreelancerProfile', FreelancerProfileSchema);
