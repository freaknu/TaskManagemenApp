import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["Low", "Med", "High"],
    default: "Low",
  },
  dueDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Task = new mongoose.Model("Task", taskSchema);
export default Task;
