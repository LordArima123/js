import express from "express";
import Todos from "./models/Todos.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import { SECRET_ACCESS_TOKEN } from "./config/index.js";
const router = express.Router();
const app = express();
const checkSession = (req, res, next) => {
  console.log("Checking Session");
  try {
    const authHeader = req.headers["cookie"]; // get the session cookie from request header
    console.log(authHeader);
    if (!authHeader) return res.sendStatus(401); // if there is no cookie from request header, send an unauthorized response.
    const cookie = authHeader.split("=")[1]; // If there is, split the cookie string to get the actual jwt
    console.log(cookie);
    console.log("config", SECRET_ACCESS_TOKEN);
    // Verify using jwt to see if token has been tampered with or if it has expired.
    // that's like checking the integrity of the cookie
    jwt.verify(cookie, SECRET_ACCESS_TOKEN, async (err, decoded) => {
      if (err) {
        // if token has been altered or has expired, return an unauthorized error
        return res
          .status(401)
          .json({ message: "This session has expired. Please login" });
      }

      const { id } = decoded; // get user id from the decoded token
      // const user = await User.findById(id); // find user by that `id`
      // const { password, ...data } = user._doc; // return user object without the password
      // req.user = data;
      console.log(id); // put the data object into req.user
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

  // if (!req.body.sessionId) {
  //   return res.status(401).send({ msg: "not permission" });
  // }

  const todos = await Todos.find({ userid: req.headers.authorization });

  return res.status(200).send({ todos: todos });
});

router.get("/todo/:id", async (req, res) => {
  //console.log(req.params.id);
  const todo = await Todos.findById(req.params.id);
  //console.log(todo);
  if (!todo) {
    return res.status(404).send({ err: "Not Found" });
  }

  if (req.body.sessionId !== todo.userid) {
    return res.status(401).send({ err: "Not Permitted" });
  }
  res.status(200).send({ todo });
}); //go to todo id

router.post("/update-todo", async (req, res) => {
  if (!req.body.sessionId) {
    return res.status(401).send({ err: "Not Permitted" });
  }
  if (!req.body.title) {
    return res.status(400).send({ err: "Bad Request" });
  }

  await Todos.findByIdAndUpdate(req.body.id, { title: req.body.title });

  res.status(200).send({ msg: "Success" });
}); //update todo

router.put("/piority", async (req, res) => {
  await Todos.findByIdAndUpdate(req.body.id, { piority: req.body.piority });

  res.redirect(`/todo/${req.body.id}`);
});

router.post("/add-todo", checkSession, async (req, res) => {
  console.log("Acessing adding todo");

  const todo = new Todos({
    title: req.body.title,
    done: false,
    piority: req.body.piority,
    userid: req.headers.authorization,
  });
  console.log(todo);

  await todo.save();

  res.status(200).send({ msg: "Success" });
}); //change exist id and push new todo

router.delete("/remove-todo/:id", async (req, res) => {
  const sessionId = req.headers.authorization;
  if (!sessionId) {
    return res.status(401).send({ err: "Not Permitted" });
  }
  console.log("Accessing Delete route");

  const todo = await Todos.findById(req.params.id);

  if (sessionId !== todo.userid) {
    return res.status(401).send({ err: "Not Permitted" });
  }
  console.log("Deleting Todo");
  await Todos.findOneAndDelete(todo);

  res.status(200).send({ msg: "Success" });
});

router.get("/toggle-todo/:id", checkSession, async (req, res) => {
  console.log("Accessing Change route");

  const todo = await Todos.findById(req.params.id);
  console.log("Changing Todo");
  await Todos.findOneAndUpdate(todo, { done: !todo.done });
  res.status(200).send({ msg: "Success" });
});

app.use(router);

export default app;
