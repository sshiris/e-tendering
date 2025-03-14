import mongoose from 'mongoose';

const userCategorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ссылка на пользователя
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true } // Ссылка на категорию
});

const UserCategory = mongoose.model('UserCategory', userCategorySchema);
export default UserCategory;
