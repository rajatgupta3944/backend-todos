require("dotenv").config();
const express = require("express");
const {authMiddleware} = require("./middleware.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {todoModel, userModel} = require("./models");

const app = express();
app.use(express.json());

// let CURRENT_USER_ID = 1;
// let CURRENT_TODO_ID = 1;

// let USERS = [];
// let TODOS = [];

app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password required"
      });
    }

    const existingUser = await userModel.findOne({ username });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      password: hashedPassword
    });

    res.json({
      id: newUser._id
    });

  } catch (err) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
});

// Authenticated

app.post("/todo", authMiddleware, (req, res) => { 
  const userId = req.userId;
  const { title, description} = req.body;
  const newTodo = todoModel.create({
    title,
    description,
    userId,
  })
  res.json({
    message: "Todo created!",
    todo: newTodo
  })
})

app.delete("/todo/:todoId", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const todoId = req.params.todoId;

    // Check if todo exists and belongs to user
    const todo = await todoModel.findOne({
      _id: todoId,
      userId: userId
    });

    if (!todo) {
      return res.status(403).json({
        message: "Either todo doesn't exist or this is not your todo!"
      });
    }

    // Delete the todo
    await todoModel.deleteOne({
      _id: todoId
    });

    res.json({
      message: "Todo deleted!"
    });

  } catch (err) {
    res.status(500).json({
      message: "Error deleting todo",
      error: err.message
    });
  }
});

app.get("/todos", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const todos = await todoModel.find({
      userId: userId
    });

    res.json({
      todos
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching todos",
      error: err.message
    });
  }
});

app.listen(3000);