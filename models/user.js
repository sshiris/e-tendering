import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  user_type: { type: String, required: true },
  password: { type: String, required: true },
  lock: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
}, { collection: 'USER' });

export default mongoose.model('User', userSchema);
