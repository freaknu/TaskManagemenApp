import mongoose from "mongoose";

// Define Task Schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Task description is required."],
      trim: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Med", "High"],
      default: "Low",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required."],
      validate: {
        validator: function (value) {
          return value >= new Date();
        },
        message: "Due date cannot be in the past.",
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required."],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create and export Task model
const Task = mongoose.model("Task", taskSchema);
export default Task;
