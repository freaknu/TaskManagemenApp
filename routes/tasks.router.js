import express from "express";
import TaskController from "../controllers/task.controller.js";
const Taskrouter = express.Router();
const taskController = new TaskController();

Taskrouter.post("/tasks", taskController.addTasks);
Taskrouter.get("/tasks", taskController.fetchTasks);

export default Taskrouter;
