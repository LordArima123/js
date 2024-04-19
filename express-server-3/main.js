import express from "express";
import knex from "knex";
import knexfile from "./knexfile.js";

const app = express();
const db = knex(knexfile);
const piority = ["Now", "High", "Moderate", "Low", "Latter"];

app.set("view engine", "ejs");

app.use("/public", express.static("public"));
//app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log("Incomming request", req.method, req.url);
  next();
});

app.get("/todos", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  const todos = await db("todos").select("*").orderBy("piority", "id");

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
    title: "Todo List",
    todos: newtodos,
  });
});

app.get("/todo/:id", async (req, res) => {
  const todos = await db("todos").select("*");

  console.log(todos);
  const todo = todos.find((todo) => {
    return todo.id === Number(req.params.id);
  });
  if (!todo) {
    return res.render("404error");
  }
  const newtodo = { ...todo, piority: piority[todo.piority - 1] };

  res.render("todo", {
    title: "Todo ",
    todo: newtodo,
  });
}); //go to todo id

app.post("/update-todo", async (req, res) => {
  const todos = await db("todos").select("*");

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

app.post("/piority", async (req, res) => {
  const todos = await db("todos").select("*");

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

app.post("/add-todo", async (req, res) => {
  const todo = {
    title: req.body.title,
    done: false,
  };
  if (!todo.title) {
    return res.redirect("/");
  }
  await db("todos").insert(todo);
  res.redirect("/");
}); //change exist id and push new todo

app.get("/remove-todo/:id", async (req, res) => {
  const todos = await db("todos").select("*");
  const todo = todos.find((todo) => {
    return todo.id === Number(req.params.id);
  });
  if (!todo.title) {
    return res.redirect("/");
  }
  await db("todos").where("id", todo.id).del();

  res.redirect("/");
});

app.get("/toggle-todo/:id", async (req, res) => {
  const todos = await db("todos").select("*");
  const todo = todos.find((todo) => {
    return todo.id === Number(req.params.id);
  });
  if (!todo) {
    return res.redirect("/");
  }

  todo.done = !todo.done;
  await db("todos").where("id", todo.id).update({ done: todo.done });
  res.redirect("/");
});

app.use((req, res) => {
  res.status(404);
  res.render("404error");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500);
  res.render("500error");
});

/*app.listen(8000, () => {
  console.log("Server listening on http://localhost:8000");
});*/

export default app;
