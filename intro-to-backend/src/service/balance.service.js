export const calculateGroupBalances = (expenses, settlements = []) => {
  const balances = {};

  expenses.forEach(exp => {
    const paidBy = exp.PaidBy.toString();
    const splitUsers = exp.splitBetween.map(u => u.toString());

    const share = exp.amount / splitUsers.length;

    // ✅ Ensure payer exists
    if (!balances[paidBy]) balances[paidBy] = 0;

    // 🔥 Payer gets full amount first
    balances[paidBy] += exp.amount;

    // 🔥 Then subtract everyone's share
    splitUsers.forEach(userId => {
      if (!balances[userId]) balances[userId] = 0;

      balances[userId] -= share;
    });
  });

  // ✅ APPLY PAID settlements
  settlements.forEach(s => {
    const from = s.from.toString();
    const to = s.to.toString();
    const amount = s.amount;

    if (!balances[from]) balances[from] = 0;
    if (!balances[to]) balances[to] = 0;

    balances[from] += amount;
    balances[to] -= amount;
  });

  return balances;
};