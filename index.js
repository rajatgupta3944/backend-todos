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
    userId: userExists.id
  }, "rajat123");
  res.json({
    token
  })
})

// Authenticated

app.post("/todo", authMiddleware, (req, res) => { 
  const userId = req.userId;
  const title = req.body.title;
  const description = req.body.description;
  TODOS.push({
    id: CURRENT_TODO_ID++,
    title,
    description,
    userId
  })
  res.json({
    message: "Todo created!"
  })
})

app.delete("/todo/:todoId", authMiddleware, (req, res) => {
  const userId = req.userId;
  const todoId = parseInt(req.params.todoId);

  const doesUserOwnTodo = TODOS.find(t => t.id === todoId && t.userId === userId);
  if(doesUserOwnTodo){
    TODOS = TODOS.filter(t => t.id !== userId);
    res.json({
      message: "Todo deleted!"
    })
  }
  else{
    res.json({
      message: "Either todo doesn't exist or this is not your todo!"
    })
  }
})

app.get("/todos", authMiddleware, (req, res) => {
  const userId = req.userId;
  const userTodos = TODOS.filter(t => t.userId === userId);
  res.json({
    todos: userTodos
  })
})

app.listen(3000);