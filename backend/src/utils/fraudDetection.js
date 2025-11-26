export const checkFraud = (expense) => {
  // simple mock: flag if amount > 1,00,000
  return expense.amount > 100000;
};
