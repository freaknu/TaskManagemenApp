import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult, body } from "express-validator";
import "dotenv/config";

// Secret key for JWT
const privateKey = process.env.PRIVATE_KEY;

class Auth {
  // Compare two passwords
  isSamePassword = async (password1, password2) => {
    return await bcrypt.compare(password1, password2);
  };

  // Hash password using bcrypt
  hashPassword = async (password) => {
    return await bcrypt.hash(password, 12); // 12 salt rounds for better security
  };

  // Generate a JWT token
  generateToken = (payload) => {
    return jwt.sign(payload, privateKey, { expiresIn: "1h" });
  };

  // Generate a refresh token
  generateRefreshToken = (payload) => {
    return jwt.sign(payload, privateKey, { expiresIn: "7d" });
  };
}

class Validate {
  // Validation rules for sign-up
  validateSignUp = () => [
    body("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long.")
      .trim(),
    body("email")
      .isEmail()
      .withMessage("Invalid email format.")
      .normalizeEmail(),
    body("password")
      .isStrongPassword()
      .withMessage(
        "Password must be at least 8 characters long, include 1 uppercase, 1 lowercase, 1 number, and 1 symbol."
      ),
  ];

  // Validation rules for sign-in
  validateSignIn = () => [
    body("email").isEmail().withMessage("Invalid email format."),
    body("password").notEmpty().withMessage("Password is required."),
  ];
}

class UserControllers {
  validate = new Validate();

  // Sign-up handler
  signUp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;
    try {
      const auth = new Auth();

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email already exists." });
      }

      // Hash password and save user
      const hashedPassword = await auth.hashPassword(password);
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      // Generate JWT tokens
      const token = auth.generateToken({ id: newUser._id });
      const refreshToken = auth.generateRefreshToken({ id: newUser._id });

      return res.status(201).json({
        message: "User created successfully.",
        token,
        refreshToken,
      });
    } catch (error) {
      console.error("Error in signUp:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  // Sign-in handler
  signIn = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      const auth = new Auth();

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      // Check if password matches
      const isPasswordCorrect = await auth.isSamePassword(
        password,
        user.password
      );
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      // Generate JWT tokens
      const token = auth.generateToken({ id: user._id });
      const refreshToken = auth.generateRefreshToken({ id: user._id });

      return res.status(200).json({
        message: "Login successful.",
        token,
        refreshToken,
      });
    } catch (error) {
      console.error("Error in signIn:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  // Refresh token handler
  refreshToken = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required." });
    }

    try {
      const user = jwt.verify(refreshToken, privateKey);
      const token = new Auth().generateToken({ id: user.id });
      return res.status(200).json({ token });
    } catch (err) {
      console.error("Error in refreshToken:", err);
      return res.status(403).json({ message: "Invalid refresh token." });
    }
  };
}

export default UserControllers;
