export const simplifyBalances = (balances) => {
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([user, amount]) => {
    const rounded = Math.round(amount * 100) / 100; // 🔥 FIX

    if (rounded > 0.01) {
      creditors.push({ user, amount: rounded });
    } else if (rounded < -0.01) {
      debtors.push({ user, amount: -rounded });
    }
  });

  const transactions = [];

  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debt = debtors[i];
    const credit = creditors[j];

    const settledAmount = Math.min(debt.amount, credit.amount);

    if (settledAmount > 0) {
      transactions.push({
        from: debt.user,
        to: credit.user,
        amount: settledAmount,
      });
    }

    debt.amount -= settledAmount;
    credit.amount -= settledAmount;

    if (debt.amount <= 0.01) i++;
    if (credit.amount <= 0.01) j++;
  }

  return transactions;
};