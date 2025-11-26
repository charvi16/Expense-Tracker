import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    amountInvested: { type: Number, required: true },
    currentValue: { type: Number, required: true },
    type: { type: String }, // mutual fund / stock / FD
  },
  { timestamps: true }
);

const Investment = mongoose.model("Investment", investmentSchema);
export default Investment;
