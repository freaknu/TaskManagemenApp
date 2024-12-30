import express from "express";
import UserControllers from "../controllers/user.controller.js";

const router = express.Router();
const userController = new UserControllers();
router.post(
  "/signup",
  userController.validate.validateSignUp(),
  userController.signUp
);
router.post(
  "/signin",
  userController.validate.validateSignIn(),
  userController.signIn
);

export default router;
