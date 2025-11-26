import mongoose from "mongoose";

const netWorthSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assets: { type: Number, default: 0 },
    liabilities: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const NetWorth = mongoose.model("NetWorth", netWorthSchema);
export default NetWorth;
