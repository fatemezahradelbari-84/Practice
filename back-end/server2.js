const express = require("express");
const app = express();

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(express.json());
app.use(logger);

let tasks = [];


const validateTaskTitle = (title) => {
  if (!title || title.trim() === "") {
    return "Title is required";
  }
  if (title.length < 3) {
    return "Title must be at least 3 characters long";
  }
  if (title.length > 100) {
    return "Title must be less than 100 characters";
  }
  return null;
};

const validateTaskId = (id) => {
  if (!id || isNaN(id)) {
    return "Invalid task ID";
  }
  return null;
};


const validateCreateTask = (req, res, next) => {
  const error = validateTaskTitle(req.body.title);
  if (error) {
    return res.status(400).json({ message: error });
  }
  next();
};

const validateTaskIdParam = (req, res, next) => {
  const error = validateTaskId(req.params.id);
  if (error) {
    return res.status(400).json({ message: error });
  }
  next();
};

const validateUpdateTask = (req, res, next) => {
  const idError = validateTaskId(req.params.id);
  if (idError) {
    return res.status(400).json({ message: idError });
  }

  const titleError = validateTaskTitle(req.body.title);
  if (titleError) {
    return res.status(400).json({ message: titleError });
  }
  next();
};


const getAllTasks = (req, res) => {
  res.json({
    message: "Tasks retrieved successfully",
    count: tasks.length,
    data: tasks
  });
};

const getTask = (req, res) => {
  const task = tasks.find((t) => t.id == req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json({
    message: "Task retrieved successfully",
    data: task
  });
};

const createTask = (req, res) => {
  const newTask = {
    id: Date.now(),
    title: req.body.title.trim(),
    createdAt: new Date().toISOString(),
    completed: false
  };
  
  tasks.push(newTask);
  res.status(201).json({
    message: "Task created successfully",
    data: newTask
  });
};

const updateTask = (req, res) => {
  const index = tasks.findIndex((t) => t.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks[index].title = req.body.title.trim();
  tasks[index].updatedAt = new Date().toISOString();
  
  res.json({
    message: "Task updated successfully",
    data: tasks[index]
  });
};

const deleteTask = (req, res) => {
  const index = tasks.findIndex((t) => t.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const deletedTask = tasks.splice(index, 1)[0];
  res.json({
    message: "Task deleted successfully",
    data: deletedTask
  });
};


app.get("/tasks", getAllTasks);
app.get("/tasks/:id", validateTaskIdParam, getTask);
app.post("/tasks", validateCreateTask, createTask);
app.put("/tasks/:id", validateUpdateTask, updateTask);
app.delete("/tasks/:id", validateTaskIdParam, deleteTask);



app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});


app.listen(4000, () => console.log("API running on http://localhost:4000"));