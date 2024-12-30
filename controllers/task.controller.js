import Task from "../models/task.models.js";
import { PriorityQueue } from "../dataStructures/Heap.js";

const pq = new PriorityQueue();

class TaskController {
  addTasks = async (req, res) => {
    try {
      const { title, description, priority, dueDate, userId } = req.body;

      if (!title || !description || !priority || !dueDate || !userId) {
        return res.status(400).json({ message: "Please fill in all fields." });
      }

      const newTask = new Task({
        title,
        description,
        priority,
        dueDate,
        userId,
      });

      await newTask.save();
      pq.insert(newTask);

      return res.status(201).json({
        message: "Task successfully added.",
        task: newTask,
      });
    } catch (error) {
      console.error("Error adding task:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  fetchTasks = async (req, res) => {
    try {
      const { userId } = req.query; // Get userId from query parameters

      if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
      }

      const tasks = await Task.find({ userId });

      tasks.forEach((task) => {
        pq.insert(task);
      });

      const sortedTasks = [];

      while (!pq.isEmpty()) {
        sortedTasks.push(pq.top());
        pq.delete();
      }

      return res.status(200).json({ tasks: sortedTasks });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  getPriorityValue(priority) {
    const priorities = { High: 3, Med: 2, Low: 1 };
    return priorities[priority] || 0;
  }
}

export default TaskController;
