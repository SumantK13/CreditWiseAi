import mongoose from 'mongoose';

const UserAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // keep only the latest analysis per user
  },
  inputs: {
    type: Object,
    required: true,
  },
  results: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserAnalysis = mongoose.model('UserAnalysis', UserAnalysisSchema);

export default UserAnalysis;

