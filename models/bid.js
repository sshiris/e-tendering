import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  bidder_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true },
  bidding_price: { type: Number, required: true, min: 0 },
  is_winner: { type: Boolean, default: false }
}, { collection: 'BID' });

export default mongoose.model('Bid', bidSchema);
