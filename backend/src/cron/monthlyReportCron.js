import cron from "node-cron";
import User from "../models/User.js";
import Expense from "../models/Expense.js";
import { resend } from "../config/resendClient.js";
import { buildMonthlyReportEmail } from "../emails/monthlyReportEmail.js";

function isLastDayOfMonth(date) {
  const tomorrow = new Date(date);
  tomorrow.setDate(date.getDate() + 1);
  return tomorrow.getDate() === 1;
}

function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const monthLabel = start.toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return { start, end, monthLabel };
}

function generatePlainAdvice(summary) {
  const advice = [];
  const { totalSpend, monthlyBudget, totalSubscriptionSpend, monthlyIncome } = summary;

  if (monthlyBudget > 0 && totalSpend > monthlyBudget) {
    advice.push("You exceeded your monthly budget – consider capping spending in top categories.");
  }
  if (monthlyBudget > 0 && totalSpend < monthlyBudget * 0.7) {
    advice.push("You're spending well below your budget. Consider increasing savings this month.");
  }
  if (totalSubscriptionSpend > totalSpend * 0.4) {
    advice.push("Subscriptions are taking a large chunk of your expenses – review unused services.");
  }
  if (monthlyIncome > 0) {
    const savings = monthlyIncome - totalSpend;
    if (savings > 0) {
      advice.push(`You saved around ₹${savings.toFixed(2)} this month — consider investing it.`);
    } else {
      advice.push("You spent more than your income — try reducing non-essential expenses.");
    }
  }
  if (advice.length === 0) {
    advice.push("Your spending pattern looks stable — good job!");
  }

  return advice;
}

// Run every day at 07:00 → but only execute on LAST DAY OF MONTH
cron.schedule("0 7 * * *", async () => {
  const today = new Date();
  if (!isLastDayOfMonth(today)) return; // ⛔ Not last day → stop

  try {
    const { start, end, monthLabel } = getCurrentMonthRange();
    console.log(`📊 Running monthly report cron for ${monthLabel}`);

    const users = await User.find({});
    for (const user of users) {
      try {
        const expenses = await Expense.find({
          user: user._id,
          date: { $gte: start, $lte: end },
        });

        const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);
        const totalSubscriptionSpend = expenses
          .filter((e) => e.isRecurring)
          .reduce((sum, e) => sum + e.amount, 0);

        const monthlyBudget = user.monthlyBudget || 0;
        const monthlyIncome = user.monthlyIncome || 0;

        const remainingBudget = monthlyBudget - totalSpend;
        const projectedNextMonth = totalSpend; // simple projection

        const categoryTotals = {};
        expenses.forEach((e) => {
          categoryTotals[e.category || "Other"] =
            (categoryTotals[e.category || "Other"] || 0) + e.amount;
        });

        const topCategories = Object.entries(categoryTotals)
          .map(([name, amount]) => ({ name, amount }))
          .sort((a, b) => b.amount - a[1])
          .slice(0, 3);

        const summary = {
          totalSpend,
          totalSubscriptionSpend,
          monthlyBudget,
          monthlyIncome,
          remainingBudget,
          projectedNextMonth,
          topCategories,
        };

        const adviceLines = generatePlainAdvice(summary);

        const html = buildMonthlyReportEmail({
          user,
          monthLabel,
          summary,
          adviceLines,
          expenses,
        });

        await resend.emails.send({
          from: "FinTrackAI Reports <onboarding@resend.dev>",
          to: user.email,
          subject: `Your ${monthLabel} Expense Report — FinTrackAI`,
          html,
        });

        console.log(`📨 Monthly report sent to ${user.email}`);
      } catch (err) {
        console.error("Error sending report to", user.email, err);
      }
    }
  } catch (err) {
    console.error("MONTHLY REPORT CRON ERROR:", err);
  }
});
