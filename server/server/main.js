import express from "express";
import Todos from "./models/Todos.js";

const router = express.Router();
const app = express();
const checkSession = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ err: "Not Permitted" });
  }
  next();
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
