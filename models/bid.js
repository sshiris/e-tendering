import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    bid_id: { type: String, required: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "USER", required: true }, // 1..M relationship
    tender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TENDER",
      required: true,
    }, // 1..M relationship
  },
  { collection: "BID" }
);

const Bid = mongoose.model("BID", bidSchema);

export default Bid;
