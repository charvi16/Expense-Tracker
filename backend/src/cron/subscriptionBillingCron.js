import cron from "node-cron";
import Subscriptions from "../models/Subscriptions.js"; // your model name
import Expense from "../models/Expense.js";

function getNextBillingDate(currentDate, cycle) {
  const d = new Date(currentDate);

  if (cycle === "weekly") {
    d.setDate(d.getDate() + 7);
  } else if (cycle === "yearly") {
    d.setFullYear(d.getFullYear() + 1);
  } else {
    // default monthly
    d.setMonth(d.getMonth() + 1);
  }

  return d;
}

// Run every day at 05:00
cron.schedule("0 5 * * *", async () => {
  try {
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const dueSubs = await Subscriptions.find({
      active: true,
      nextBillingDate: { $gte: startOfToday, $lte: endOfToday },
    });

    if (!dueSubs.length) return;

    console.log(`📅 Subscription billing cron: ${dueSubs.length} due today`);

    for (const sub of dueSubs) {
      try {
        // 1) Create an Expense entry
        await Expense.create({
          user: sub.user,
          amount: sub.amount,
          category: sub.category || "Subscriptions",
          description: sub.name,
          paymentMethod: sub.paymentMethod || "Auto debit",
          date: new Date(),
          isRecurring: true,
          fraudFlag: false,
        });

        // 2) Advance nextBillingDate
        sub.nextBillingDate = getNextBillingDate(sub.nextBillingDate, sub.billingCycle);
        await sub.save();
      } catch (err) {
        console.error("Error processing subscription:", sub._id, err);
      }
    }
  } catch (err) {
    console.error("SUBSCRIPTION BILLING CRON ERROR:", err);
  }
});
