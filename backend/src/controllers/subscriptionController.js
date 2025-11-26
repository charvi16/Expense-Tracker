import Subscriptions from "../models/Subscriptions.js";

export const getSubscriptions = async (req, res) => {
  try {
    const subs = await Subscriptions.find({ user: req.user._id, active: true });
    res.json(
      subs.map((s) => ({
        name: s.name,
        amount: s.amount,
        interval: s.interval,
      }))
    );
  } catch {
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
};
