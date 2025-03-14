import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: String,
  user_type: String,
  password: { type: String, required: true },
  lock: { type: Boolean, default: false },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }] // Связь с категориями
});

const User = mongoose.model('User', userSchema);
export default User;
