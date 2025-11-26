import Subscriptions from "../models/Subscriptions.js";

export const getSubscriptions = async (req, res) => {
  try {
    const subs = await Subscriptions.find({
      user: req.user._id,
      active: true,
    }).sort({ nextBillingDate: 1 });

    res.json(subs);
  } catch (err) {
    console.error("GET SUBSCRIPTIONS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
};

/**
 * CREATE A NEW SUBSCRIPTION
 */
export const createSubscription = async (req, res) => {
  try {
    console.log("📩 RECEIVED BODY:", req.body);
    const { name, amount, billingCycle, nextBillingDate, paymentMethod } = req.body;

    if (!name || !amount || !billingCycle || !nextBillingDate) {
      console.log("❌ Missing field");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sub = await Subscriptions.create({
      user: req.user._id,
      name,
      amount,
      billingCycle,
      nextBillingDate: new Date(nextBillingDate),
      paymentMethod: paymentMethod || "",
      active: true,
    });

    res.status(201).json(sub);
  } catch (err) {
    console.error("CREATE SUBSCRIPTION ERROR:", err);
    res.status(500).json({ message: "Failed to create subscription" });
  }
};

/**
 * UPDATE A SUBSCRIPTION
 */
export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const sub = await Subscriptions.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!sub) return res.status(404).json({ message: "Subscription not found" });

    const { name, amount, billingCycle, nextBillingDate, paymentMethod, active } = req.body;

    if (name !== undefined) sub.name = name;
    if (amount !== undefined) sub.amount = amount;
    if (billingCycle !== undefined) sub.billingCycle = billingCycle;
    if (nextBillingDate !== undefined)
      sub.nextBillingDate = new Date(nextBillingDate);
    if (paymentMethod !== undefined) sub.paymentMethod = paymentMethod;
    if (active !== undefined) sub.active = active;

    const updated = await sub.save();

    res.json(updated);
  } catch (err) {
    console.error("UPDATE SUBSCRIPTION ERROR:", err);
    res.status(500).json({ message: "Failed to update subscription" });
  }
};

/**
 * DELETE (SOFT DELETE) SUBSCRIPTION
 */
export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const sub = await Subscriptions.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!sub) return res.status(404).json({ message: "Subscription not found" });

    // Soft delete → keep DB clean
    sub.active = false;
    await sub.save();

    res.json({ message: "Subscription deleted" });
  } catch (err) {
    console.error("DELETE SUBSCRIPTION ERROR:", err);
    res.status(500).json({ message: "Failed to delete subscription" });
  }
};
