import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: String,
  user_type: String,
  password: String,
  lock: { type: Boolean, default: false },
  email: String,
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }] // Ссылка на категорию
});

const User = mongoose.model('User', userSchema);
export default User;
