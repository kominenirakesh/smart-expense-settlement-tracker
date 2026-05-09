import mongoose from "mongoose";
import { Group } from "../models/group.model.js";
import {Expense} from "../models/expense.model.js"
import { User } from "../models/user.model.js";
import Settlement from "../models/Settlement.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { sendReminderEmail } from "../service/email.service.js";
import { createSettlementsFromBalances } from "../service/settlement.service.js";
import { calculateGroupBalances } from "../service/balance.service.js";
import { simplifyBalances } from "../service/settle.service.js";
import { markSettlementAsPaid } from "../service/settlement.service.js";

export const Create = async (req, res, next) => {
  try {
    const { name, members } = req.body; // members will be emails from frontend

    if (!name || !members || !Array.isArray(members)) {
      return next(new ApiError(400, "All fields are required"));
    }

    // Check if group already exists
    const GroupExisting = await Group.findOne({ name });
    if (GroupExisting) {
      return next(new ApiError(400, "GroupName already Exists"));
    }

    // ✅ Resolve emails to user IDs
    const users = await User.find({ email: { $in: members } });
    if (!users.length) {
      return next(new ApiError(400, "No valid members found"));
    }

    const memberIds = users.map(u => u._id);

    // ✅ Create group with IDs
    const creategroup = await Group.create({
      name,
      CreatedBy: req.user.id,
      members: [req.user.id, ...memberIds],
    });

    res.status(201).json(new ApiResponse(201, creategroup, "GroupCreated"));
  } catch (error) {
    next(error);
  }
};

// export const Create = async (req,res,next)=>
// {
//      try {
//         const{name,members} = req.body;
//         if(!name || !members)
//         {
//           return next(new ApiError(400,"All fields are required"));
//         }
//         const GroupExisiting = await Group.findOne({name});
//         if(GroupExisiting)
//         {
//           return next(new ApiError(400,"GroupName already Exists"));
//         }
//         console.log(req.user);
//         const creategroup = await Group.create(
//           {
//             name,
//             CreatedBy:req.user.id,
//             members:[req.user.id,...members],
//           }
//         );
//         res.status(201).json(new ApiResponse(201,creategroup,"GroupCreated"));
         
//      } catch (error) {
//        next(error);  
//      }
// }

export const GetGroupByID = async(req,res,next)=>
{
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "username email")
      .populate("CreatedBy", "username email");  // 🔥 ADD THIS

    if(!group || group.length === 0)
    {
      console.log(req.user.id);
      return next(new ApiError(404,"Data Not Found"));
    }
    res.status(200).json(new ApiResponse(200,group,"Group name fetched Successfully..!!"));    
  } catch (error) {
    next(error);
  }
}



export const AddMembers = async (req, res, next) => {
  try {
    const group = req.params.id;
    const { members } = req.body; // expecting an array of new members

    const updatedGroup = await Group.findByIdAndUpdate(
      group,
      {
        $addToSet: { members: { $each: members } } // avoids duplicates
      },
      { new: true } // return updated document
    );

    if (!updatedGroup) {
      return res.status(404).json(new ApiResponse(404, null, "Group not found"));
    }

    res.status(201).json(new ApiResponse(201, updatedGroup, "Members added successfully"));
  } catch (error) {
    next(error);
  }
};

// export const GetGroupBalance = async (req, res, next) => {
//   try {
//     const group = req.params.id;

//     // ✅ Use "PaidBy" to match Expense schema
//     // ✅ Use "username" to match User schema
//     const expenses = await Expense.find({ group })
//       .populate("PaidBy", "username")
//       .populate("splitBetween", "username");

//     if (!expenses.length) {
//       return next(new ApiError(404, "No expenses found"));
//     }

//     const balances = {};

//     expenses.forEach(expense => {
//       if (!expense.PaidBy) return; // defensive check

//       const splitAmount = expense.amount / expense.splitBetween.length;
//       const payer = expense.PaidBy.username; // ✅ use username

//       expense.splitBetween.forEach(member => {
//         if (!member) return; // defensive check
//         const debtor = member.username; // ✅ use username

//         if (debtor !== payer) {
//           if (!balances[debtor]) balances[debtor] = {};
//           if (!balances[payer]) balances[payer] = {};

//           balances[debtor][payer] =
//             (balances[debtor][payer] || 0) + splitAmount;
//         }
//       });
//     });

//     const simplified = [];

//     Object.keys(balances).forEach(debtor => {
//       Object.keys(balances[debtor]).forEach(creditor => {
//         const amount = balances[debtor][creditor];
//         const reverse = balances[creditor] && balances[creditor][debtor];

//         if (reverse) {
//           if (amount > reverse) {
//             simplified.push({
//               from: debtor,
//               to: creditor,
//               amount: amount - reverse
//             });
//           }
//           balances[creditor][debtor] = 0;
//           balances[debtor][creditor] = 0;
//         } else if (amount > 0) {
//           simplified.push({
//             from: debtor,
//             to: creditor,
//             amount
//           });
//         }
//       });
//     });

//     res.status(200).json({
//       success: true,
//       data: simplified,
//       message: "Group balance calculated"
//     });
//   } catch (error) {
//     next(error);
//   }
// };



export const getGroupSettlements = async (req, res, next) => {
  try {
   const group = new mongoose.Types.ObjectId(req.params.id);

const settlements = await Settlement.find({ group: group })
  .populate("from", "username upiId")
  .populate("to", "username upiId");

    res.status(200).json({
      success: true,
      data: settlements,
    });

  } catch (error) {
    next(error);
  }
};

export const GetGroupBalance = async (req, res, next) => {
  try {
    const group = req.params.id;

    const expenses = await Expense.find({ group: group });
    const settlements = await Settlement.find({
      group: group,
      status: "paid"
    });

    if (!expenses.length) {
      return next(new ApiError(404, "No expenses found"));
    }

    // ✅ Step 1: Calculate balances (ID based)
    const balances = calculateGroupBalances(expenses, settlements);

    // ✅ Step 2: Simplify
    const transactions = simplifyBalances(balances);

    // 🔥 Step 3: STORE settlements
    await createSettlementsFromBalances(group, transactions);

    res.status(200).json({
      success: true,
      data: transactions,
      message: "Group balance calculated",
    });

  } catch (error) {
    next(error);
  }
};


export const markAsPaid = async (req, res, next) => {
  try {
    const { settlementId } = req.params;
    console.log("RECEIVED ID:", settlementId);

    // 1️⃣ Mark as paid (safe)
    const updated = await markSettlementAsPaid(settlementId);

    // 🔥 Handle stale ID (VERY IMPORTANT)
    if (!updated || updated?.alreadyHandled) {
      return res.status(200).json({
        success: true,
        message: "Settlement already processed (ID refreshed)",
      });
    }

    const group = updated.group;

    // 2️⃣ Recalculate balances
    const expenses = await Expense.find({ group });

    const paidSettlements = await Settlement.find({
      group: group,
      status: "paid",
    });

    const balances = calculateGroupBalances(expenses, paidSettlements);

    // 3️⃣ Simplify
    const transactions = simplifyBalances(balances);

    // 4️⃣ 🔥 Regenerate settlements
    await Settlement.deleteMany({
      group: group,
      status: "pending",
    });

    await createSettlementsFromBalances(group, transactions);

    // 5️⃣ Response
    res.status(200).json({
      success: true,
      message: "Settlement marked as paid",
    });

  } catch (error) {
    console.error("ERROR IN MARK AS PAID:", error);
    next(error);
  }
};

export const SendReminder = async (req, res, next) => {
  try {

    console.log(req.body); // debug

    const { email, debtor, creditor, amount, groupName } = req.body;

console.log(email, debtor, creditor, amount, groupName);
    if (!email || !debtor || !creditor || !amount) {
      return next(new ApiError(400, "Missing required fields"));
    }

    await sendReminderEmail(email, debtor, creditor, amount, groupName);

    res.status(200).json(
      new ApiResponse(200, null, "Reminder email sent successfully")
    );

  } catch (error) {
    next(error);
  }
};

export const GetGroups = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id); // ✅ FIX

    const groups = await Group.find({
      members: userId,
    }).populate("members", "username");

    const enrichedGroups = [];

    for (const group of groups) {
      const expenses = await Expense.find({ group: group._id });

      const paidSettlements = await Settlement.find({
        group: group._id,
        status: "paid",
      });

      const balances = calculateGroupBalances(
        expenses,
        paidSettlements
      );

      const userBalance = balances[userId.toString()] || 0;

      enrichedGroups.push({
        ...group.toObject(),
        balance: userBalance,
      });
    }

    res.status(200).json({
      success: true,
      data: enrichedGroups,
    });

  } catch (error) {
    next(error);
  }
};

export const updateGroup = async (req, res, next) => {
  try {
    const group = req.params.id;
    const { name, members } = req.body;

    const updatedGroup = await Group.findByIdAndUpdate(
      group,
      {
        name,
        members,
      },
      { new: true }
    ).populate("members", "username email");

    if (!updatedGroup) {
      return next(new ApiError(404, "Group not found"));
    }

    res.status(200).json(
      new ApiResponse(200, updatedGroup, "Group updated successfully")
    );
  } catch (error) {
    next(error);
  }
};


