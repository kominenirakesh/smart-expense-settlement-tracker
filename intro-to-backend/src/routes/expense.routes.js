import express from 'express';
import {verifyToken} from "../middleware/auth.middleware.js";
import {AddExpense,GetExpense,GetGroupExpenses,getBalances} from "../controllers/expense.controller.js";
const router = express.Router();
router.post("/add",verifyToken,AddExpense);
router.get("/get/:id",verifyToken,GetExpense);
router.get("/group/:groupId",verifyToken,GetGroupExpenses);
router.get("/balance/:groupId",verifyToken, getBalances);
export default router;