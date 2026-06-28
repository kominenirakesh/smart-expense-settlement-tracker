import { Expense } from "../models/expense.model.js";
import Settlement from "../models/Settlement.js";
// 🔥 NEW   
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { splitExpense } from "../service/expense.service.js";
import { calculateGroupBalances } from "../service/balance.service.js";
import { simplifyBalances } from "../service/settle.service.js";
// 🔥 your existing service (we will use it properly now)

import { createSettlementsFromBalances } from "../service/settlement.service.js";
// ===================== ADD EXPENSE =====================
export const AddExpense = async (req, res, next) => {
  try {
    const { amount, description, category, groupId, splitBetween } = req.body;
    // console.log("REQ BODY:", req.body);
    // console.log("REQ USER:", req.user);

    if (!amount || !groupId) {
      return next(new ApiError(400, "Amount and groupId required"));
    }

    // 1️⃣ Create expense
    const userId = req.user._id || req.user.id;


    const expense = await Expense.create({
      amount,
      description,
      category,
      PaidBy: req.body.paidBy || req.body.PaidBy || userId,
      groupId,
      splitBetween,
    });

    // 2️⃣ Fetch all expenses of group
    const expenses = await Expense.find({ groupId: groupId });

    // 3️⃣ Include PAID settlements (🔥 CRITICAL FIX)
    const paidSettlements = await Settlement.find({
      group: groupId,
      status: "paid"
    });

    // 4️⃣ Calculate correct balances
    const balances = calculateGroupBalances(expenses, paidSettlements);

    // 5️⃣ Simplify balances → transactions
    const transactions = simplifyBalances(balances);

    // 6️⃣ 🔥 Regenerate ONLY pending settlements
    await Settlement.deleteMany({
      group: groupId,
      status: "pending"
    });

    await createSettlementsFromBalances(groupId, transactions);

    // 7️⃣ Response
    res.status(200).json({
      success: true,
      message: "Expense added successfully",
      balances,
      transactions,
    });

  } catch (error) {
    next(error);
  }
};

// ===================== GET SINGLE EXPENSE =====================
export const GetExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate("PaidBy", "username")
      .populate("groupId", "name")
      .populate("splitBetween", "username");

    if (!expense) {
      return next(new ApiError(404, "Expense not found"));
    }

    res.status(200).json(
      new ApiResponse(200, expense, "Expense fetched")
    );

  } catch (error) {
    next(error);
  }
};
// ===================== GET GROUP EXPENSES =====================
export const GetGroupExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({
      groupId: req.params.groupId,
    })
      .populate("PaidBy", "username")
      .populate("splitBetween", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(
      new ApiResponse(200, expenses, "Group expenses fetched")
    );

  } catch (error) {
    next(error);
  }
};
// ===================== GET BALANCES + SETTLEMENT =====================
export const getBalances = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;

    // 1️⃣ Get expenses
    const expenses = await Expense.find({ groupId: groupId });

    // 2️⃣ 🔥 Include PAID settlements
    const paidSettlements = await Settlement.find({
      group: groupId,
      status: "paid"
    });

  const balances = calculateGroupBalances(expenses, paidSettlements);

    // console.log("🔥 BALANCES:", balances);

    const transactions = simplifyBalances(balances);

    console.log("🔥 TRANSACTIONS:", transactions);
    // 5️⃣ 🔥 Regenerate ONLY pending settlements
    await Settlement.deleteMany({
      group: groupId,
      status: "pending"
    });

    await createSettlementsFromBalances(groupId, transactions);

    // ================= ENRICH USER DATA =================

    const userIds = new Set();
    transactions.forEach(t => {
      userIds.add(t.from.toString());
      userIds.add(t.to.toString());
    });

    const users = await User.find({
      _id: { $in: Array.from(userIds) }
    }).select("username upiId");

    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u;
    });

    const enrichedTransactions = transactions.map(t => ({
      from: {
        _id: t.from,
        name: userMap[t.from]?.username || "Unknown",
        upiId: userMap[t.from]?.upiId || ""
      },
      to: {
        _id: t.to,
        name: userMap[t.to]?.username || "Unknown",
        upiId: userMap[t.to]?.upiId || ""
      },
      amount: t.amount
    }));

    // 6️⃣ Final response
    res.status(200).json({
      success: true,
      balances,
      transactions: enrichedTransactions,
    });

  } catch (error) {
    next(error);
  }
};