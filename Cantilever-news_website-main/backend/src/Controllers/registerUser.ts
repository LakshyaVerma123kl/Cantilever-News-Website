import { Request, Response } from "express";
import { User } from "../Models/schema";
import { generateToken, verifyToken } from "../Middleware/jwtToken";
import { sendEmail } from "../mailService";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

const verifyUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Request received with body:", req.body);
    const { name, username, password, email } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const user = { name, username, password, email };
    const token = generateToken(user);
    // console.log(token);

    await sendEmail(email, token, "verify?type=1&");
    res
      .status(200)
      .json({ message: "Verification email sent successfully, Check Inbox" });
  } catch (err) {
    res.status(400).json({ error: "Error processing Request" });
    console.log(err);
  }
};

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ message: "User need to log in to access this page." });
      return;
    }
    const token = authHeader.split(" ")[1];
    const user = verifyToken(token) as JwtPayload;
    if (user === null || !user) {
      res.status(403).json({ message: "Unauthorized request" });
      return;
    }
    const saltRounds = 10;
    const cryptPassword = await bcrypt.hash(user.password, saltRounds);
    console.log(cryptPassword);

    const newUser = new User({
      name: user.name,
      email: user.email,
      password: cryptPassword,
      username: user.username,
    });
    await newUser.save();
    console.log(newUser);

    const responsetoken = generateToken({
      email: newUser.email,
      id: newUser._id,
      username: newUser.username,
    });
    res
      .status(200)
      .json({ message: "User Registered successfully", token: responsetoken });
  } catch (err) {
    res.status(400).json({ error: "Error processing Request" });
    console.log(err);
  }
};

export { verifyUser, registerUser };
