import mongoose from 'mongoose';

const DeliverableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['image', 'document', 'code', 'other'],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    required: true,
  },
});

export default mongoose.models.Deliverable || mongoose.model('Deliverable', DeliverableSchema); 