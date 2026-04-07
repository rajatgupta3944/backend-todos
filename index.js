const express = require("express");
const {authMiddleware} = require("./middleware.js");
const jwt = require("jsonwebtoken");
const {todoModel, userModel} = require("./models");

const app = express();
app.use(express.json());

// let CURRENT_USER_ID = 1;
// let CURRENT_TODO_ID = 1;

// let USERS = [];
// let TODOS = [];

app.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // const existingUser = USERS.find(u => u.username === username);
  const existingUser = await userModel.findOne({
    username: username,
    password: password,
  })
  if (existingUser){
    res.status(403).json({
      message: "User with this username already exists!"
    })
    return;
  }
  if(existingUser){
    res.status(403).json({
      message: "User with this username already exists!"
    })
    return;
  }
  const newUser = userModel.create({
    username: username,
    password: password
  })
res.json({
  id: newUser._id
})
})

app.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const userExists = await userModel.findOne({
    username: username,
    password: password,
  })
  if(!userExists){
    res.status(403).json({
      message: "Incorrect credentials!"
    })
  }
  const token = jwt.sign({
    userId: userExists._id.toString()
  }, "rajat123");
  res.json({
    token
  })
})

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