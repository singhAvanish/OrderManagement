// src/controllers/authController.ts
import { Request, Response } from "express";
import Admin from "../models/adminModel";
import generateToken from "../utils/generateToken";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await (admin as any).matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: admin._id,
      email: admin.email,
      token: generateToken(admin._id.toString()),
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
};
export const signupAdmin = async (req: Request, res: Response) => {
  console.log("🟢 signupAdmin controller hit");

  const { name, email, password, adminPassKey } = req.body;
  
  if (adminPassKey !== process.env.ADMIN_SIGNUP_KEY) {
    console.log("🔴 Invalid pass key:", adminPassKey);
    return res.status(403).json({ message: "Invalid admin pass key" });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("🛑 Admin already exists");
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { id: newAdmin._id, email: newAdmin.email },
      process.env.JWT_SECRET || "",
      { expiresIn: "1h" }
    );

    console.log("✅ Admin registered");
    res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
      },
    });
  } catch (err) {
    console.error("❌ Signup error", err);
    res.status(500).json({ message: "Signup failed", error: err });
  }
};
