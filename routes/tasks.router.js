import express from "express";
import TaskController from "../controllers/task.controller.js";
import authentication from "../middleware/auth.middleware.js";
const Taskrouter = express.Router();
const taskController = new TaskController();

Taskrouter.post("/addtasks", authentication, taskController.addTasks);
Taskrouter.get("/tasks", authentication, taskController.fetchTasks);
Taskrouter.put("/updatetask/:id", authentication, taskController.updateTask);
Taskrouter.delete("/deletetask/:id", authentication, taskController.deleteTask);
export default Taskrouter;
