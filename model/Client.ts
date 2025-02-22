import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
  },
  projectsPosted: {
    type: Number,
    default: 0,
  },
  completedProjects: {
    type: Number,
    default: 0,
  },
  trustScore: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
  },
  industry: {
    type: String,
  },
  website: {
    type: String,
  },
  about: {
    type: String,
  },
  linkedinUrl: {
    type: String,
  },
  walletaddress: {
    type: String,
  },
});

export default mongoose.models.Client || mongoose.model('Client', ClientSchema);