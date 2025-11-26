import Expense from "../models/Expense.js";

export default async function aiBudgetAdvice(userId) {
  const expenses = await Expense.find({ user: userId });

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  if (!total) {
    return ["Start logging expenses to get personalized advice."];
  }

  return [
    "You're spending steadily. Consider setting category-based budgets.",
    "Try to keep food + dining under 30% of your monthly expenses.",
  ];
}
