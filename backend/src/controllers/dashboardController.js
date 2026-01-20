import User from "../models/User.js";
import Expense from "../models/Expense.js";
import Subscriptions from "../models/Subscriptions.js";
import groq from "../config/groqClient.js";

async function generateAiInsights(summary) {
  try {
    console.log("➡️ Hitting GROQ AI...");
    const completion = await groq.chat.completions.create({
      model: "llama3-groq-70b-8192", //key not working currently because montly calls are hit
      messages: [
        {
          role: "system",
          content:
            "You are a friendly but concise personal finance assistant. " +
            "You analyze a user's spending and budget and give short, actionable insights.",
        },
        {
          role: "user",
          content:
            "Analyze this JSON about my monthly finances and generate 4–6 short bullet-point insights. " +
            "Each insight should be on a single line, without numbering. " +
            "Focus on spending patterns, overspending risks, savings opportunities, and any anomalies.\n\n" +
            JSON.stringify(summary),
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const text = completion.choices?.[0]?.message?.content || "";

    // turn the model output into an array of clean lines
    const insights = text
      .split("\n")
      .map((line) => line.replace(/^[-•\d.]+\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 6);

    return insights;
  } catch (err) {
    console.error("AI INSIGHTS ERROR:", err.message || err);
    return [];
  }
}

export const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const expenses = await Expense.find({
      user: req.user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const monthSpend = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Top spending category
    let topCategory = null;
    if (expenses.length > 0) {
      const catTotals = {};
      expenses.forEach((e) => {
        catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
      });
      topCategory = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0][0];
    }

    const subs = await Subscriptions.find({
      user: req.user._id,
      active: true
    });

    const today = new Date();
    const threeDays = 3 * 24 * 60 * 60 * 1000;

    const upcomingBills = subs.filter(s => {
    const diff = new Date(s.nextBillingDate) - today;
    return diff > 0 && diff <= threeDays;
    });

    let subscriptionMonthlyTotal = 0;

    subs.forEach(sub => {
      if (sub.billingCycle === "monthly") subscriptionMonthlyTotal += sub.amount;
      if (sub.billingCycle === "weekly") subscriptionMonthlyTotal += sub.amount * 4;
      if (sub.billingCycle === "yearly") subscriptionMonthlyTotal += sub.amount / 12;
    });

    const totalSpendIncludingSubs = monthSpend + subscriptionMonthlyTotal;

    // Avg daily spend (till today)
    const daysPassed = now.getDate();
    const totalDays = endOfMonth.getDate();
    const avgDaily = daysPassed > 0 ? totalSpendIncludingSubs / daysPassed : 0;

    // Expected month end spend (projection)
    const monthEndExpected = avgDaily * totalDays;

    const monthlyBudget = user?.monthlyBudget || 0;
    const monthlyIncome = user?.monthlyIncome || 0;

    const projectedSavings =
      monthlyBudget > 0 ? monthlyBudget - monthEndExpected : null;

    const totalBalance = monthlyIncome - totalSpendIncludingSubs;

    // Build a summary object for AI
    const summary = {
      month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}`,
      monthlyBudget,
      monthlyIncome,
      monthSpend,
      totalBalance,
      avgDaily,
      monthEndExpected,
      projectedSavings,
      topCategory,
      categoryTotals: expenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {}),
      paymentMethods: expenses.reduce((acc, e) => {
        const key = e.paymentMethod || "Other";
        acc[key] = (acc[key] || 0) + e.amount;
        return acc;
      }, {}),
    };

    console.log("➡️ Generating AI insights...");

    const aiInsights = await generateAiInsights(summary);

    res.json({
      totalBalance,
      monthlyBudget,
      monthSpend : totalSpendIncludingSubs,
      subscriptions : subs,
      subscriptionMonthlyTotal,
      upcomingBills,
      topCategory,
      avgDaily: Number(avgDaily.toFixed(2)),
      monthEndExpected: Number(monthEndExpected.toFixed(2)),
      projectedSavings:
        projectedSavings !== null ? Number(projectedSavings.toFixed(2)) : null,
      aiInsights, // 👈 ACTUAL AI-GENERATED INSIGHTS
      expenses: expenses, // 👈 ADD EXPENSES DATA
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Dashboard fetch failed", error: err.message });
  }
};
