import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  category_id: { type: String, required: true, unique: true },
  category_name: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { collection: 'CATEGORY' });

export default mongoose.model('Category', categorySchema);
