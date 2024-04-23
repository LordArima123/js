import express from "express";
import knex from "knex";
import knexfile from "./knexfile.js";

import loginRouter from "./login.js";
import session from "express-session";

const router = express.Router();
const app = express();
const db = knex(knexfile);
const piority = ["Now", "High", "Moderate", "Low", "Latter"];

//app.set("view engine", "ejs");
////app.set("views", path.join(__dirname, "views")); // Specify the directory where your EJS templates are located
//
//app.use("/public", express.static("public"));
//app.use(express.urlencoded({ extended: true }));
//
//app.use((req, res, next) => {
//  console.log("Incoming request", req.method, req.url);
//  next();
//});
router.use((req, res, next) => {
  console.log("Incomming request", req.method, req.url);
  next();
});

router.get("/todos", async (req, res) => {
  console.log("Accessing /todos route");
  if (!req.session.userId) {
    return res.redirect("/");
  }
  console.log(req.session.userId);
  const todos = await db("todos")
    .select("*")
    .where("userid", req.session.userId)
    .orderBy("piority", "id");
  console.log(todos);
  const newtodos = todos.map((todo) => {
    // const newtodo = {
    //   id: todo.id,
    //   title: todo.title,
    //   done: todo.done,
    //   piority: piority[todo.piority - 1],
    // };

    const newtodo = { ...todo, piority: piority[todo.piority - 1] };
    return newtodo;
  });

  res.render("index", {
    title: "todos",
    todos: newtodos,
  });
});

router.get("/todo/:id", async (req, res) => {
  const todos = await db("todos").select("*");

  console.log(todos);
  const todo = todos.find((todo) => {
    return todo.id === Number(req.params.id);
  });
  if (!todo) {
    return res.render("404error");
  }
  const newtodo = { ...todo, piority: piority[todo.piority - 1] };
  if (req.session.userId !== newtodo.userid) {
    return res.redirect("/todos");
  }
  res.render("todo", {
    title: "Todo ",
    todo: newtodo,
  });
}); //go to todo id

router.post("/update-todo", async (req, res) => {
  const todos = await db("todos")
    .select("*")
    .where("userid", req.session.userId);

  const todo = todos.find((todo) => {
    return todo.id === Number(req.body.id);
  });

  if (!todo || !todo.id || !req.body.title) {
    return res.redirect(`todo/${todo.id}`);
  }

  todo.title = req.body.title;
  await db("todos").where("id", todo.id).update({ title: todo.title });

  res.redirect(`/todo/${todo.id}`);
}); //update todo

router.post("/piority", async (req, res) => {
  const todos = await db("todos")
    .select("*")
    .where("userid", req.session.userId);

  const todo = todos.find((todo) => {
    return todo.id === Number(req.body.id);
  });

  if (!todo || !todo.id) {
    return res.redirect(`todo/${todo.id}`);
  }

  todo.piority = req.body.piority;

  await db("todos").where("id", todo.id).update({ piority: todo.piority });

  res.redirect(`/todo/${todo.id}`);
});

router.post("/add-todo", async (req, res) => {
  console.log(Number(req.session.userId));

  const todo = {
    title: req.body.title,
    done: false,
    userId: Number(req.session.userId),
  };
  if (!todo.title) {
    return res.redirect("/todos");
  }
  console.log(todo);
  await db("todos").insert(todo);
  res.redirect("/todos");
}); //change exist id and push new todo

router.get("/remove-todo/:id", async (req, res) => {
  const todos = await db("todos").select("*");
  const todo = todos.find((todo) => {
    return todo.id === Number(req.params.id);
  });
  if (!todo.title) {
    return res.redirect("/todos");
  }
  if (req.session.userId !== todo.userid) {
    return res.redirect("/todos");
  }
  console.log("Deleting Todo");
  await db("todos").where("id", todo.id).del();

  res.redirect("/todos");
});

router.get("/toggle-todo/:id", async (req, res) => {
  const todos = await db("todos").select("*");
  const todo = todos.find((todo) => {
    return todo.id === Number(req.params.id);
  });
  if (!todo) {
    return res.redirect("/todos");
  }
  if (req.session.userId !== todo.userid) {
    return res.redirect("/todos");
  }

  todo.done = !todo.done;
  console.log("Changing Todo");
  await db("todos").where("id", todo.id).update({ done: todo.done });
  res.redirect("/todos");
});

/*app.listen(8000, () => {
  console.log("Server listening on http://localhost:8000");
});*/
app.use(router);

export default app;
