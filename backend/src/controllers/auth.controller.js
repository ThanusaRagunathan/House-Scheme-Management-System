import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByUsername, createUser, findUserByPhone, updatePassword } from "../models/user.model.js";
import { ApiError } from "../middleware/error.middleware.js";

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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.user_id, role: user.role },
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
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      throw new ApiError(400, "Missing required fields");
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      throw new ApiError(409, "Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser(username, hashedPassword, role);

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
    const { phone, otp, newPassword } = req.body;

    if (!phone || !otp || !newPassword) {
      throw new ApiError(400, "Phone, OTP, and new password are required");
    }

    const record = otpStore.get(phone);
    if (!record) {
      throw new ApiError(400, "No OTP requested for this phone number");
    }

    if (Date.now() > record.expiry) {
      otpStore.delete(phone);
      throw new ApiError(400, "OTP has expired");
    }

    if (record.otp !== otp) {
      throw new ApiError(400, "Invalid OTP");
    }

    // Password validation: min 8 chars, uppercase, lowercase, numbers, symbols
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{}|\\:;"'<>,.?/~`]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new ApiError(400, "Password must be at least 8 characters long, incorporating uppercase, lowercase, numbers, and symbols");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const success = await updatePassword(record.userId, hashedPassword);

    if (!success) {
      throw new ApiError(500, "Failed to update password");
    }

    otpStore.delete(phone); // Clear OTP after success
    res.json({ message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};
