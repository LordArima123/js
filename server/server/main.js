import express from "express";
import Todos from "./models/Todos.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import BlackList from "./models/BlackList.js";
import { SECRET_ACCESS_TOKEN } from "./config/index.js";
const router = express.Router();
const app = express();
const checkSession = async (req, res, next) => {
  console.log("Checking Session");

  try {
    const authHeader = req.headers["cookie"];
    const cookie = authHeader.split("=")[1];
    if (!cookie) return res.status(401); // if there is no cookie from request header, send an unauthorized response.
    const checkIfBlackList = await BlackList.findOne({ token: cookie });
    if (checkIfBlackList) return res.status(401);
    jwt.verify(cookie, SECRET_ACCESS_TOKEN, async (err, decoded) => {
      console.log("Verifying!");
      if (err) {
        return res
          .status(401)
          .json({ message: "This session has expired. Please login" });
      }

      const { id } = decoded;
      req.userID = id;
      next();
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
};

router.get("/todos", checkSession, async (req, res) => {
  console.log("Accessing /todos route");
  const todos = await Todos.find({ userid: req.userID });
  return res.status(200).send({ todos: todos });
});

router.get("/todo/:id", checkSession, async (req, res) => {
  const todo = await Todos.findById(req.params.id);
  if (!todo) {
    return res.status(404).send({ message: "Not Found" });
  }
  res.status(200).send({ todo });
}); //go to todo id

router.put("/update-todo", async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({ message: "Bad Request" });
  }
  await Todos.findByIdAndUpdate(req.body.id, { title: req.body.title });
  res.status(200).send({ message: "Success" });
}); //update todo

router.put("/piority", async (req, res) => {
  await Todos.findByIdAndUpdate(req.body.id, { piority: req.body.piority });
  res.status(200).send({ message: "Success" });
});

router.post("/add-todo", checkSession, async (req, res) => {
  console.log("Acessing adding todo");

  const todo = new Todos({
    title: req.body.title,
    done: false,
    piority: req.body.piority,
    userid: req.userID,
  });
  console.log(todo);
  await todo.save();
  res.status(200).send({ message: "Success" });
}); //change exist id and push new todo

router.delete("/remove-todo/:id", checkSession, async (req, res) => {
  console.log("Accessing Delete route");
  const todo = await Todos.findById(req.params.id);
  if (req.userID !== todo.userid) {
    return res.status(401).send({ err: "Not Permitted" });
  }
  console.log("Deleting Todo");
  await Todos.findOneAndDelete(todo);
  res.status(200).send({ message: "Success" });
});

router.get("/toggle-todo/:id", checkSession, async (req, res) => {
  console.log("Accessing Change route");
  const todo = await Todos.findById(req.params.id);
  console.log("Changing Todo");
  await Todos.findOneAndUpdate(todo, { done: !todo.done });
  res.status(200).send({ message: "Success" });
});

app.use(router);

export default app;
