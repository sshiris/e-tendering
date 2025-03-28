import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  category_id: { type: String, required: true, unique: true },
  category_name: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'USER' }] // Ссылка на коллекцию USER
}, { collection: 'CATEGORY' });

const Category = mongoose.model('CATEGORY', categorySchema);

export default Category;
