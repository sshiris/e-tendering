import mongoose from 'mongoose';

const userTypeSchema = new mongoose.Schema({
  type_id: { type: String, required: true, unique: true },
  type_name: { type: String, required: true }
}, { collection: 'USER_TYPE' });

const UserType = mongoose.model('USER_TYPE', userTypeSchema);

export default UserType;
