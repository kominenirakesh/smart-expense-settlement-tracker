export const splitExpense = (amount, PaidBy, members) => {
  if (!Array.isArray(members) || members.length === 0) {
    return [];
  }

  const splitAmount = amount / members.length;
  const balances = [];

  members.forEach(member => {
    if (!member) return; // skip invalid entries
    if (member.toString() !== PaidBy.toString()) {
      balances.push({
        user: member,
        owes: splitAmount
      });
    }
  });

  return balances;
};
