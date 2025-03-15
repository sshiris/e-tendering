import mongoose from 'mongoose';

const tenderSchema = new mongoose.Schema({
  tender_id: { type: String, required: true, unique: true },
  tender_name: { type: String, required: true },
  construction_from: { type: Date, required: true },
  construction_to: { type: Date, required: true },
  date_of_tender_notice: { type: Date, required: true },
  date_of_tender_close: { type: Date, required: true },
  date_of_tender_winner: { type: Date },
  bidding_price: { type: Number, required: true, min: 0 },
  tender_status: { type: String, enum: ['Open', 'Closed', 'Pending'], default: 'Pending' },
  staff_id: { type: String, required: true },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }]
}, { collection: 'TENDER' });

export default mongoose.model('Tender', tenderSchema);
