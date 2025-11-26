import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, default: "Subscription" },
    paymentMethod: {type: String, default : "UPI"},
    billingCycle: {
      type: String,
      enum: ["monthly", "weekly", "yearly"],
      default: "monthly",
    },
    nextBillingDate: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Subscriptions = mongoose.model("Subscriptions", subscriptionSchema);
export default Subscriptions;
