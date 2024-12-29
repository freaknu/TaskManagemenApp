import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult, body } from "express-validator";
import "dotenv/config";

const privateKey = process.env.PRIVATE_KEY;

class Validate {
  validateSignUp = () => [
    body("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long."),
    body("email").isEmail().withMessage("Invalid email format."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ];

  validateSignIn = () => [
    body("email").isEmail().withMessage("Invalid email format."),
    body("password").notEmpty().withMessage("Password is required."),
  ];
}

class Authent_ication {
  isSamePassword = async (password1, password2) => {
    try {
      return await bcrypt.compare(password1, password2);
    } catch (error) {
      console.error("Error comparing passwords:", error);
      throw new Error("Password comparison failed.");
    }
  };

  hashPassword = async (password) => {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      console.error("Error hashing password:", error);
      throw new Error("Password hashing failed.");
    }
  };

  generateToken = (payload) => {
    try {
      if (!privateKey) {
        throw new Error("PRIVATE_KEY is not defined.");
      }
      return jwt.sign(payload, privateKey, { expiresIn: "1h" });
    } catch (error) {
      console.error("Error generating token:", error);
      throw new Error("Token generation failed.");
    }
  };
}

class UserControllers {
  validate = new Validate(); // Instantiate the Validate class

  SignUp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array() });
    const { name, email, password } = req.body;
    try {
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email already exists." });
      }

      const auth = new Authent_ication();
      const hashedPassword = await auth.hashPassword(password);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = auth.generateToken({ id: newUser._id });

      return res.status(201).json({
        message: "User created successfully.",
        token,
      });
    } catch (error) {
      console.error("Error in SignUp:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  SignIn = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array() });
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const auth = new Authent_ication();
      const isPasswordCorrect = await auth.isSamePassword(
        password,
        user.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const token = auth.generateToken({ id: user._id });

      return res.status(200).json({
        message: "Login successful.",
        token,
      });
    } catch (error) {
      console.error("Error in SignIn:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };
}

export { Authent_ication, UserControllers };
