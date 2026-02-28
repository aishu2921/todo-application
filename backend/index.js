const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Todo = require("./models/todo");
//const Todo = require("./models/counter");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb+srv://aiswarya:aishu2005@cluster0.dw7rdin.mongodb.net/todolist")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));



app.get("/todolist", async (req, res) => {
  try {
    const tasks = await Todo.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});


app.get("/counts", async (req, res) => {
  try {
    const total = await Todo.countDocuments();
    const completed = await Todo.countDocuments({ status: true });

    res.json({ total, completed });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});


app.post("/todolist", async (req, res) => {
  try {
    const newTask = new Todo({
      userTask: req.body.userTask,
    });

    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ error: "Add Error" });
  }
});


app.put("/todolist/:id", async (req, res) => {
  try {
    const task = await Todo.findById(req.params.id);
    task.status = req.body.status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Update Error" });
  }
});


app.delete("/todolist/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Server running"));