import cron from "node-cron";
import Subscriptions from "../models/Subscriptions.js";
import { sendEmail } from "../utils/emailService.js";

// Run every day at 9am
cron.schedule("0 9 * * *", async () => {
  const today = new Date();
  const upcoming = await Subscriptions.find({
    active: true,
    nextBillingDate: {
      $gte: today,
      $lte: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
    },
  }).populate("user");

  for (const sub of upcoming) {
    await sendEmail(
      sub.user.email,
      "Upcoming subscription charge",
      `Your subscription "${sub.name}" of ₹${sub.amount} is due soon.`
    );
  }
});
