const express = require("express");
const app = express();

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(express.json());
app.use(logger);

let tasks = [];

const getAllTasks = (req, res) => {
  res.json(tasks);
};

const getTask = (req, res) => {
  const task = tasks.find((t) => t.id == req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
};

const createTask = (req, res) => {
  const newTask = {
    id: Date.now(),
    title: req.body.title,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
};

const updateTask = (req, res) => {
  const index = tasks.findIndex((t) => t.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Task not found" });

  tasks[index].title = req.body.title;
  res.json(tasks[index]);
};

const deleteTask = (req, res) => {
  tasks = tasks.filter((t) => t.id != req.params.id);
  res.json({ message: "Task deleted" });
};

app.get("/tasks", getAllTasks);
app.get("/tasks/:id", getTask);
app.post("/tasks", createTask);
app.put("/tasks/:id", updateTask);
app.delete("/tasks/:id", deleteTask);

app.listen(4000, () => console.log("API running on http://localhost:4000"));