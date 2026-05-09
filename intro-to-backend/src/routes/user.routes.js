import express from "express";
import {registerUser,loginUser,logoutUser,deleteUser, searchUsers} from "../controllers/user.controller.js";
import {verifyToken} from "../middleware/auth.middleware.js";
const router =  express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/logout',verifyToken,logoutUser);
router.delete('/delete',verifyToken,deleteUser);
router.get("/search", verifyToken, searchUsers);

export default router;