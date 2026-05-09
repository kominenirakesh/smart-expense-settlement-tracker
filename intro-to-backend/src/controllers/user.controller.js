import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {Group }from "../models/group.model.js";
import {Expense} from "../models/expense.model.js";
import Settlement from "../models/Settlement.js";


dotenv.config();

// REGISTER USER
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password,upiId} = req.body;

    if (!username || !email || !password||!upiId) {
      return next(new ApiError(400, "All fields are required"));
    }

    const userExisting = await User.findOne({ username: username.toLowerCase() });
    if (userExisting) {
      return next(new ApiError(400, "Username already exists"));
    }

    const emailExisting = await User.findOne({ email: email.toLowerCase() });
    if (emailExisting) {
      return next(new ApiError(400, "Email already exists"));
    }

    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      upiId
    });

    res.status(201).json(new ApiResponse(201, user, "User registered"));
  } catch (error) {
    next(error);
  }
};

// LOGIN USER
export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(new ApiError(400, "Username and password required"));
    }

    const user = await User.findOne({ username: username.toLowerCase() }).select("+password");
    if (!user) {
      return next(new ApiError(400, "Username or password does not exist"));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ApiError(401, "Login failed: incorrect username or password"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json(new ApiResponse(200, { user, token }, "Login successful"));
  } catch (error) {
    next(error);
  }
};

// LOGOUT USER
export const logoutUser = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    res.status(200).json(new ApiResponse(200, null, "Logout successful"));
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1️⃣ Remove user from all groups
    await Group.updateMany(
      { members: userId },
      { $pull: { members: userId } }
    );

    // 2️⃣ Delete all expenses created by user
    await Expense.deleteMany({ paidBy: userId });

    // 3️⃣ Delete settlements involving user
    await Settlement.deleteMany({
      $or: [{ from: userId }, { to: userId }],
    });

    // 4️⃣ Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query required" });
    }

    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("_id username email");

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};