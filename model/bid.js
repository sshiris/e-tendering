import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  bidder_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Ссылка на пользователя
  tender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender' }, // Ссылка на тендер
  bidding_price: Number,
  is_winner: { type: Boolean, default: false }
});

const Bid = mongoose.model('Bid', bidSchema);
export default Bid;
