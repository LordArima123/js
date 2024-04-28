import express from "express";

import User from "./models/User.js";

const router = express.Router();

const app = express();

router.use((req, res, next) => {
  console.log("Incomming request", req.method, req.url);
  next();
});

router.post("/register", async (req, res) => {
  const newuser = new User({
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  const usercheck = await User.findOne({ email: newuser.email });
  if (usercheck) {
    return res.status(409).send({ error: "Email address already in use" });
  } else {
    console.log(usercheck);
    try {
      await newuser.save();
      console.log("User created");
      return res.status(200).send({ msg: "Success" });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ err: "Error" });
    }
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user || !(await user.verifyPassword(`${req.body.password}`))) {
    return res.status(401).send({ err: "Invalid Email or Password!" });
  } else {
    console.log("loged in");
    req.session.userId = user.id;
    res.status(200).send({ msg: "Login successful" });
  }
});

router.post("/logout", async (req, res) => {
  req.session.userId = NaN;
  res.status(200).send({ msg: "Log Out successful" });
});

/*router.listen(8000, () =>
  console.log(`Server running on http://localhost:8000`)
);*/

app.use(router);

export default app;
