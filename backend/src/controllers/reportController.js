import User from "../models/User.js";
import Expense from "../models/Expense.js";
import { resend } from "../config/resendClient.js";
import { buildMonthlyReportEmail } from "../emails/monthlyReportEmail.js";

export const sendManualMonthlyReport = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // use current month
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const monthLabel = start.toLocaleString("en-GB", {
      month: "long",
      year: "numeric",
    });

    const expenses = await Expense.find({
      user: user._id,
      date: { $gte: start, $lte: end },
    });

    const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalSubscriptionSpend = expenses
      .filter((e) => e.isRecurring)
      .reduce((sum, e) => sum + e.amount, 0);

    const summary = {
      totalSpend,
      totalSubscriptionSpend,
      monthlyBudget: user.monthlyBudget || 0,
      monthlyIncome: user.monthlyIncome || 0,
      remainingBudget: (user.monthlyBudget || 0) - totalSpend,
      projectedNextMonth: totalSpend,
      topCategories: [],
    };

    const adviceLines = ["This is a test email. AI advice will appear here."];

    const html = buildMonthlyReportEmail({
      user,
      monthLabel,
      summary,
      adviceLines,
      expenses,
    });

    await resend.emails.send({
      from: "FinTrackAI Reports <reports@yourdomain.com>",
      to: user.email,
      subject: `Your Monthly Expense Report (Manual Test)`,
      html,
    });

    res.json({ success: true, message: "Report sent to your email." });
  } catch (err) {
    console.error("Manual report send failed:", err);
    res.status(500).json({ message: "Failed to send report" });
  }
};
