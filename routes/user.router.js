import express from "express";
import { UserControllers } from "../controllers/user.controller.js";

const router = express.Router();
const userController = new UserControllers(); // Renamed to camelCase

// Routes
router.post(
  "/signup",
  userController.validate.validateSignUp(), // Add validation middleware
  userController.SignUp // Controller method
);

router.post(
  "/signin",
  userController.validate.validateSignIn(), // Add validation middleware
  userController.SignIn // Controller method
);

export default router;