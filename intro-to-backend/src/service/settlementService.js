import Settlement from "../models/Settlement.js";
import { simplifyBalances } from "./balanceService.js";

export const regenerateSettlements = async (groupId, balances) => {
  // 1. Delete old settlements
  await Settlement.deleteMany({ group: groupId });

  // 2. Generate new simplified settlements
  const newSettlements = simplifyBalances(balances);

  // 3. Insert new settlements
  const settlementsToInsert = newSettlements.map(s => ({
    group: groupId,
    from: s.from,
    to: s.to,
    amount: s.amount,
    status: "pending"
  }));

  await Settlement.insertMany(settlementsToInsert);

  return settlementsToInsert;
};