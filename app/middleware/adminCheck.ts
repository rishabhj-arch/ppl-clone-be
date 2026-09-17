import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../db/models/user";

export interface IadminUserRequest extends Request {
  user: any;
}

const generateJWTAccessToken = (user: any) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWTKEY, {
    expiresIn: "12h", // Token will expire in 12 hours
  });
  return token;
};

const adminVerify = async (
  req: IadminUserRequest,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(400).json({
      success: false,
      message: "Token is required",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTKEY) as {
      _id: string;
      email: string;
    };

    const user = await User.findById(decoded._id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Unauthorized!",
      });
      return;
    }
    req.user = user;

    next();
  } catch (error) {
    res
      .status(403)
      .send({ success: false, message: "Token expired", error: error.message });
  }
};

export { adminVerify, generateJWTAccessToken };
