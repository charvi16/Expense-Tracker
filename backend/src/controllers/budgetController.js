import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";

export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).sort({ month: 1 });
    const enriched = await Promise.all(
      budgets.map(async (b) => {
        const [year, month] = b.month.split("-");
        const start = new Date(Number(year), Number(month) - 1, 1);
        const end = new Date(Number(year), Number(month), 0, 23, 59, 59);

        const spentAgg = await Expense.aggregate([
          {
            $match: {
              user: req.user._id,
              date: { $gte: start, $lte: end },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const spent = spentAgg[0]?.total || 0;
        const remaining = b.budget - spent;
        return {
          month: b.month,
          budget: b.budget,
          spent,
          remaining,
        };
      })
    );
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch budgets" });
  }
};
