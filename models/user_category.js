import mongoose from 'mongoose';

const userCategorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'USER', required: true }, // Reference to User
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CATEGORY', required: true } // Reference to Category
}, { collection: 'USER_CATEGORY' }); // Explicitly set collection name

const UserCategory = mongoose.model('USER_CATEGORY', userCategorySchema);

export default UserCategory;
