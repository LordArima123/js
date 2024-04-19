import express from "express";
import knex from "knex";
import knexfile from "./knexfile.js";
import bcrypt from "bcrypt";
import createUser from "./models/Usermodels.js";

const router = express();
const db = knex(knexfile);

router.set("view engine", "ejs");

router.use("/public", express.static("public"));

router.use(express.urlencoded({ extended: true }));

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
    email: req.body.iemail,
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

router.post("/login", async (req, res) => {
  const users = await db("user").select("*");
  const user = users.find((user) => {
    return user.email === req.body.iemail;
  });
  console.log(users);
  if (!user) {
    return res.render("warn", {
      message: "Wrong Email!",
      returnl: "",
    });
  }
  const hashedInputPassword = await bcrypt.hash(req.body.password, user.salt);
  if (hashedInputPassword == user.password) {
    req.session.userId = user.id;
    //res.json({ email: user.email });
    res.redirect("/todos");
  } else {
    return res.render("warn", {
      message: "Wrong Password!",
      returnl: "",
    });
  }
});

router.use((req, res) => {
  res.status(404);
  res.render("404error");
});

router.use((err, req, res, next) => {
  console.error(err);
  res.status(500);
  res.render("500error");
});

/*router.listen(8000, () =>
  console.log(`Server running on http://localhost:8000`)
);*/
export default router;
