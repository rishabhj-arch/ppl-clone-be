import { Request, Response } from "express";
import * as passwordHelper from "../helpers/password.helper";
import User from "../db/models/user";
import { generateJWTAccessToken } from "../middleware/adminCheck";

export interface UserDetails {
  username: string;
  email: string;
  password: string;
}

export const userRegister = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedUsername = username.trim();
    if (!trimmedEmail || !trimmedUsername) {
      res.status(400).json({
        success: false,
        message: "Username, email are required.",
      });
      return;
    }
    const existing = await User.findOne({ email: trimmedEmail });
    if (existing) {
      res
        .status(409)
        .json({ success: false, message: "User with email already exists." });
      return;
    }
    if (!trimmedPassword) {
      res.status(404).json({
        success: false,
        message: "Password is required to create user.",
      });
      return;
    }
    let encryptedMessage = "";
    encryptedMessage = await passwordHelper.encryptPassword(trimmedPassword);
    const user = await User.create({
      username: trimmedUsername,
      email: trimmedEmail,
      password: encryptedMessage,
    });
    res.status(200).json({ success: true, message: "User created.", user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", e: error.message });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail) {
      res.status(400).json({
        success: false,
        message: "Username is required.",
      });
      return;
    }
    if(!trimmedPassword) {
      res.status(400).json({
        success: false,
        message: "Password is required.",
      });
      return;
    }

    const user = await User.findOne({ email: trimmedEmail });

    if (!user) {
      res
        .status(404)
        .json({ success: false, message: "User not found.", isError: true });
      return;
    }
    const encryptedMessage = await passwordHelper.decryptPassword(
      trimmedPassword,
      user.password
    );
    if (!encryptedMessage) {
      res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again.",
        isError: true,
      });
      return;
    }
    const token = generateJWTAccessToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user,
    });
  } catch (error) {
    res.status(403).json({ success: false, message: "Error logging in user." });
  }
};
