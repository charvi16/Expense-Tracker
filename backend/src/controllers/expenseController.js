import Expense from '../models/Expense.js';

export const createExpense = async (req, res) => {
  try {
    const { amount, category, date, method, notes } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      amount: Number(amount),
      category,
      description: notes || "",
      paymentMethod: method || "",
      date: date || new Date(),
      // isRecurring will use default from schema
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error("CREATE EXPENSE ERROR:", err);
    res.status(500).json({ message: 'Failed to create expense' });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error("GET EXPENSES ERROR:", err);
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};
