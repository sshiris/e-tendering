import mongoose from 'mongoose';

const tenderSchema = new mongoose.Schema({
  tender_id: { type: String, required: true, unique: true },
  tender_name: { type: String, required: true },
  construction_from: Date,
  construction_to: Date,
  date_of_tender_notice: Date,
  date_of_tender_close: Date,
  date_of_tender_winner: Date,
  bidding_price: Number,
  tender_status: String,
  staff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Ссылка на пользователя
});

const Tender = mongoose.model('Tender', tenderSchema);
export default Tender;
