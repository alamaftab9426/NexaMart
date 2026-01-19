import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserProfile from "../models/UserProfile.js";
import crypto from "crypto";
import nodemailer from "nodemailer";



export const signup = async (req, res) => {
  try {
    const {
      name,
      lastname,
      mobileno,
      emailaddress,
      password,
      confirmpassword,
      gender,
      dob,
    } = req.body;

    if (
      !name ||
      !lastname ||
      !mobileno ||
      !emailaddress ||
      !password ||
      !confirmpassword ||
      !gender ||
      !dob
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ emailaddress });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      lastname,
      mobileno,
      emailaddress,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      gender,
      dob,
    });

    await UserProfile.create({
      user: newUser.id,
      name: newUser.name,
      profilePhoto: "",
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "3H" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: newUser,
    });
  } catch (err) {
    console.log("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const login = async (req, res) => {
  try {
    const { emailaddress, password } = req.body;

    const user = await User.findOne({ emailaddress });
    if (!user) {
      return res.status(400).json({ message: "Try Again" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account is deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password Wrong" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        emailaddress: user.emailaddress,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllUsers = async (req, res) => {
  try {

    const users = await User.find();
    res.status(200).json({ users });
  }
  catch (err) {
    res.status(500).json({ success: false, message: "Error fetching users", error: err });

  }


};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: `User has been ${isActive ? "activated" : "deactivated"}`,
      user,
    });
  } catch (err) {

    res.status(500).json({ message: "Failed to update user status" });
  }
};


export const forgotPassword = async (req, res) => {
  const { emailaddress } = req.body;
  try {
    const user = await User.findOne({ emailaddress });
    if (!user) return res.status(404).json({ message: "User not found" });


    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; 
    await user.save();
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;


    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"EvalueWebSolution" <${process.env.EMAIL_USER}>`,
      to: user.emailaddress,
      subject: "Password Reset Request",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fff;">
      <h2 style="color: #e53e3e; text-align: center;">Password Reset Request</h2>
      <p>Hello ${user.name},</p>
      <p>You recently requested to reset your password. Click the button below to reset it:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetURL}" style="
          display: inline-block;
          padding: 12px 25px;
          font-size: 16px;
          color: #fff;
          background: linear-gradient(90deg, #f56565, #c53030);
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        ">Reset Password</a>
      </div>

      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all;"><a href="${resetURL}" style="color: #3182ce;">${resetURL}</a></p>

      <p style="color: #718096; font-size: 12px;">This link will expire in 1 hour. If you didn’t request a password reset, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="text-align: center; color: #718096; font-size: 12px;">Your App Team</p>
    </div>
  `
    });


    res.status(200).json({ message: "Password reset email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmpassword } = req.body;

    if (!password || !confirmpassword)
      return res.status(400).json({ message: "All fields required" });

    if (password !== confirmpassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.confirmPassword = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful. Please login.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

