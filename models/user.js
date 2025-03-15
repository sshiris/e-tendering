import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  user_type: { type: String, required: true },
  password: { type: String, required: true },
  lock: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  tenders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tender' }],
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }]
}, { collection: 'USER' });

const User = mongoose.model('User', userSchema);

export default User;
