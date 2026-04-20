import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByUsername, createUser, findUserByPhone, updatePassword, findUserById, updateUser } from "../models/user.model.js";
import { ApiError } from "../middleware/error.middleware.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    // Don't send password
    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { username, phone } = req.body;
    const success = await updateUser(req.user.id, { username, phone });
    if (!success) {
      throw new ApiError(500, "Failed to update profile");
    }
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    next(error);
  }
};

const otpStore = new Map(); // Store OTP details in-memory: Map<phone, {otp, expiry, userId}>

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new ApiError(400, "Missing credentials");
    }

    const user = await findUserByUsername(username);
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    if (user.isFirstLogin) {
      return res.status(403).json({ message: "Password reset required" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.user_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { username, password, role, email, phone } = req.body;

    if (!username || !password || !role) {
      throw new ApiError(400, "Missing required fields");
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      throw new ApiError(409, "Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser(username, hashedPassword, role, email, phone);

    res.status(201).json({ message: "User created successfully", userId });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      throw new ApiError(400, "Phone number is required");
    }

    const user = await findUserByPhone(phone);
    if (!user) {
      throw new ApiError(404, "Phone number not registered");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(phone, { otp, expiry, userId: user.user_id });

    // In a real app, send OTP via SMS here!
    console.log(`Generated OTP for ${phone}: ${otp}`);

    res.json({ message: "OTP sent successfully", otp }); // returning OTP for demo/testing
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      throw new ApiError(400, "Missing required fields");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password = ?, isFirstLogin = FALSE WHERE user_id = ? AND is_deleted = 0",
      [hashedPassword, userId]
    );

    res.json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};
