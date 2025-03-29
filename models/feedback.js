import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  tender_id: { type: String, required: false }, // Optional if feedback is not tied to a specific tender
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
}, { collection: 'FEEDBACK' });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
