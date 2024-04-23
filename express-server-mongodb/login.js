import express from "express";
import knex from "knex";
import knexfile from "./knexfile.js";
import bcrypt from "bcrypt";
import createUser from "./models/Usermodels.js";
import appRouter from "./main.js";

import session from "express-session";

const router = express.Router();
const db = knex(knexfile);
const app = express();

//app.use(appRouter);
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

router.get("/", async (req, res) => {
  res.render("login");
});

router.get("/register", async (req, res) => {
  res.render("register");
});

router.post("/registernew", async (req, res) => {
  const users = await db("user").select("*");
  const newuser = {
    firstname: req.body.firstName,
    lastname: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  };
  console.log(users);
  const usercheck = users.find((usercheck) => {
    return usercheck.email == newuser.email;
  });
  if (usercheck) {
    return res.render("warn", {
      message: "Email Existed!",
      returnl: "register",
    });
  } else {
    console.log(usercheck);
    try {
      await createUser(newuser);
      console.log("User created");
    } catch (err) {
      console.error(err);
    }
  }
  res.redirect("/");
});

router.post("/login", async (req, res, next) => {
  // const users = await db("user").select("*");
  // const user = users.find((user) => {
  //   return user.email === req.body.email;
  // });
  const user = await db("user")
    .select("*")
    .where("email", req.body.email)
    .first();
  console.log(user);
  if (!user) {
    return res.render("warn", {
      message: "Wrong Email!",
      returnl: "",
    });
  }
  const hashedInputPassword = await bcrypt.hash(req.body.password, user.salt);
  if (hashedInputPassword === user.password) {
    console.log("loged in");
    req.session.userId = user.id;
    req.session.save(function (err) {
      // session saved
      if (err) {
        next(err);
      }
    });
    //res.json({ email: user.email });
    res.redirect("/todos");
  } else {
    return res.render("warn", {
      message: "Wrong Password!",
      returnl: "",
    });
  }
});

router.post("/logout", async (req, res) => {
  req.session.userId = NaN;
  res.redirect("/");
});

/*router.listen(8000, () =>
  console.log(`Server running on http://localhost:8000`)
);*/

app.use(router);

export default app;
