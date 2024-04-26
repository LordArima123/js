import express from "express";

import User from "./models/User.js";

const router = express.Router();

const app = express();

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
  const newuser = new User({
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  const usercheck = await User.findOne({ email: newuser.email });
  if (usercheck) {
    return res.render("warn", {
      message: "Email Existed!",
      link: "register",
    });
  } else {
    console.log(usercheck);
    try {
      await newuser.save();
      console.log("User created");
    } catch (err) {
      console.error(err);
    }
  }
  res.redirect("/");
});

router.post("/login", async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  //console.log(user);
  //console.log(user.password);
  if (!user || !(await user.verifyPassword(`${req.body.password}`))) {
    return res.render("warn", {
      message: "Wrong Email or Password!",
      link: "",
    });
  } else {
    console.log("loged in");
    req.session.userId = user.id;
    req.session.save(function (err) {
      if (err) {
        next(err);
      }
    });
    res.redirect("/todos");
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
