import Expense from "../models/Expense.js";

export const getCalendar = async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59);

    const expenses = await Expense.find({
      user: req.user._id,
      date: { $gte: start, $lte: end },
    });

    const days = {};
    expenses.forEach((e) => {
      const d = e.date.getDate();
      days[d] = (days[d] || 0) + e.amount;
    });

    const totalDays = end.getDate();
    const result = [];
    for (let d = 1; d <= totalDays; d++) {
      result.push({ day: d, total: days[d] || 0 });
    }

    res.json({ days: result });
  } catch {
    res.status(500).json({ message: "Failed to load calendar" });
  }
};
