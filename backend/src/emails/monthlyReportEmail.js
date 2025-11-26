export function buildMonthlyReportEmail({ user, monthLabel, summary, adviceLines, expenses }) {
  const {
    totalSpend,
    totalSubscriptionSpend,
    monthlyBudget,
    monthlyIncome,
    remainingBudget,
    projectedNextMonth,
    topCategories
  } = summary;

  const adviceHtml = adviceLines && adviceLines.length
    ? `<ul>${adviceLines.map(a => `<li>${a}</li>`).join("")}</ul>`
    : "<p>No specific advice this month – you're doing fine!</p>";

  const categoryHtml = topCategories.length
    ? `<ul>${topCategories.map(c => `<li>${c.name}: ₹${c.amount.toFixed(2)}</li>`).join("")}</ul>`
    : "<p>No category data available.</p>";

  const expensesHtml = expenses.length
    ? `
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th align="left">Date</th>
            <th align="left">Category</th>
            <th align="left">Description</th>
            <th align="right">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${expenses
            .map(
              (e) => `
            <tr>
              <td>${new Date(e.date).toISOString().slice(0, 10)}</td>
              <td>${e.category || "-"}</td>
              <td>${e.description || "-"}</td>
              <td align="right">${e.amount.toFixed(2)}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `
    : "<p>No expenses recorded in this month.</p>";

  return `
    <h2>Monthly Expense Report (${monthLabel})</h2>
    <p>Hi ${user.name || ""}, here's a summary of your finances for <strong>${monthLabel}</strong>.</p>

    <h3>Overview</h3>
    <ul>
      <li><strong>Total Spend:</strong> ₹${totalSpend.toFixed(2)}</li>
      <li><strong>Subscription Spend:</strong> ₹${totalSubscriptionSpend.toFixed(2)}</li>
      <li><strong>Monthly Budget:</strong> ₹${monthlyBudget.toFixed(2)}</li>
      <li><strong>Monthly Income:</strong> ₹${monthlyIncome.toFixed(2)}</li>
      <li><strong>Remaining Budget:</strong> ₹${remainingBudget.toFixed(2)}</li>
      <li><strong>Projected Next Month Spend:</strong> ₹${projectedNextMonth.toFixed(2)}</li>
    </ul>

    <h3>Top Spending Categories</h3>
    ${categoryHtml}

    <h3>Smart Suggestions</h3>
    ${adviceHtml}

    <h3>Full Expense List</h3>
    ${expensesHtml}

    <p style="margin-top: 16px;">– FinTrackAI</p>
  `;
}
