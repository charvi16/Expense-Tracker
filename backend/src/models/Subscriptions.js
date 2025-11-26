import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    interval: { type: String, enum: ["month", "year", "week"], default: "month" },
    nextBillingDate: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Subscriptions = mongoose.model("Subscriptions", subscriptionSchema);
export default Subscriptions;
