import Settlement from "../models/Settlement.js";

/**
 * Create settlements from simplified transactions
 */
export const createSettlementsFromBalances = async (groupId, transactions) => {
  try {

    // ✅ FIX 3 — PLACE HERE
    if (!transactions.length) {
      console.log("⚠️ No settlements to create");
    }

    for (const t of transactions) {
      await Settlement.create({
        group: groupId,
        from: t.from,
        to: t.to,
        amount: t.amount,
        status: "pending",
      });
    }

  } catch (error) {
    console.error("Error creating settlements:", error);
    throw error;
  }
};


export const markSettlementAsPaid = async (settlementId) => {
  console.log("RECEIVED ID:", settlementId);

  const settlement = await Settlement.findById(settlementId);

  if (!settlement) {
    console.log("❌ Settlement not found in DB");
    return { alreadyHandled: true };
  }

  settlement.status = "paid";
  settlement.paidAt = new Date();

  await settlement.save();

  return settlement;
};