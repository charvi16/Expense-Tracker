import Expense from "../models/Expense.js";

export const getAnalytics = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });

    // ----- total per month -----
    const monthly = {};
    expenses.forEach((e) => {
      const key = `${e.date.getFullYear()}-${(e.date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`; // e.g. 2025-11
      monthly[key] = (monthly[key] || 0) + e.amount;
    });

    // ----- total per category -----
    const categories = {};
    expenses.forEach((e) => {
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    });

    // ----- simple daily trend (last 30 days) -----
    const now = new Date();
    const last30 = expenses.filter(
      (e) => now - e.date <= 30 * 24 * 60 * 60 * 1000
    );
    const daily = {};
    last30.forEach((e) => {
      const key = e.date.toISOString().slice(0, 10); // YYYY-MM-DD
      daily[key] = (daily[key] || 0) + e.amount;
    });

    // ----- payment method distribution -----
    const methods = {};
    expenses.forEach((e) => {
      const key = e.paymentMethod || "Other";
      methods[key] = (methods[key] || 0) + e.amount;
    });

    res.json({
      monthlySpendingChart: monthly,
      categoryChart: categories,
      dailyTrendChart: daily,
      paymentMethodChart: methods,
    });
  } catch (err) {
    console.error("ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
