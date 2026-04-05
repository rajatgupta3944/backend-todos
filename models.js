const mongoose = require("mongoose");

 // mongoose schema and model object

 mongoose.connect("");
 const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
 });

 const TodoSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: mongoose.Types.ObjectId,
 })

 const userModel = mongoose.model("users", UserSchema);
 const todoModel = mongoose.model("todos", TodoSchema);

 module.exports = {
  userModel: userModel,
  todoModel: todoModel
 }