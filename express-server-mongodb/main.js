import express from "express";
import Todos from "./models/Todos.js";

const router = express.Router();
const app = express();

const piority = ["Now", "High", "Moderate", "Low", "Latter"];

router.use((req, res, next) => {
  console.log("Incomming request", req.method, req.url);
  next();
});

router.get("/todos", async (req, res) => {
  console.log("Accessing /todos route");
  if (!req.session.userId) {
    return res.render("warn", {
      message: "Not Permitted",
      returnl: "",
    });
  }
  //console.log(req.session.userId);

  const todos = await Todos.find({ userid: req.session.userId }).sort(
    "piority"
  );

  //console.log(todos);
  const newtodos = todos.map((todo) => {
    const newtodo = {
      ...todo._doc,
      id: todo.id,
      piority: piority[todo.piority - 1],
    };
    return newtodo;
  });
  //console.log(newtodos);

  res.render("index", {
    title: "Todos",
    todos: newtodos,
  });
});

router.get("/todo/:id", async (req, res) => {
  //console.log(req.params.id);
  const todo = await Todos.findById(req.params.id);
  //console.log(todo);
  if (!todo) {
    return res.render("404error");
  }
  const newtodo = {
    ...todo._doc,
    id: todo.id,
    piority: piority[todo.piority - 1],
  };
  if (req.session.userId !== newtodo.userid) {
    return res.render("warn", {
      message: "Not Permitted",
      returnl: "",
    });
  }
  res.render("todo", {
    title: "Todo ",
    todo: newtodo,
  });
}); //go to todo id

router.post("/update-todo", async (req, res) => {
  if (!req.session.userId) {
    return res.render("warn", {
      message: "Not Permitted",
      returnl: "",
    });
  }
  if (!req.body.title) {
    return res.redirect(`todo/${req.body.id}`);
  }

  await Todos.findByIdAndUpdate(req.body.id, { title: req.body.title });

  res.redirect(`/todo/${req.body.id}`);
}); //update todo

router.post("/piority", async (req, res) => {
  await Todos.findByIdAndUpdate(req.body.id, { piority: req.body.piority });

  res.redirect(`/todo/${req.body.id}`);
});

router.post("/add-todo", async (req, res) => {
  if (!req.session.userId) {
    return res.render("warn", {
      message: "Not Permitted",
      returnl: "",
    });
  }
  console.log(req.session.userId);

  const todo = new Todos({
    title: req.body.title,
    done: false,
    userid: req.session.userId,
  });
  if (!todo.title) {
    return res.redirect("/todos");
  }
  console.log(todo);

  await todo.save();

  res.redirect("/todos");
}); //change exist id and push new todo

router.get("/remove-todo/:id", async (req, res) => {
  const todo = await Todos.findById(req.params.id);
  if (!todo.title) {
    return res.redirect("/todos");
  }
  if (req.session.userId !== todo.userid) {
    return res.render("warn", {
      message: "Not Permitted",
      returnl: "",
    });
  }
  console.log("Deleting Todo");
  await Todos.findOneAndDelete(todo);

  res.redirect("/todos");
});

router.get("/toggle-todo/:id", async (req, res) => {
  const todo = await Todos.findById(req.params.id);
  if (!todo) {
    return res.redirect("/todos");
  }
  if (req.session.userId !== todo.userid) {
    return res.render("warn", {
      message: "Not Permitted",
      returnl: "",
    });
  }
  console.log("Changing Todo");
  await Todos.findOneAndUpdate(todo, { done: !todo.done });
  res.redirect("/todos");
});

/*app.listen(8000, () => {
  console.log("Server listening on http://localhost:8000");
});*/
app.use(router);

export default app;
