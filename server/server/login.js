import express from "express";
import User from "./models/User.js";
import BlackList from "./models/BlackList.js";
import cors from "cors";

const router = express.Router();
// router.use(cors());
const app = express();

router.post("/register", async (req, res) => {
  const newuser = new User({
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });

  const usercheck = await User.findOne({ email: newuser.email });

  if (usercheck) {
    console.log("Sending error 409");
    return res.status(409).send({ error: "Email address already in use" });
  } else {
    console.log(usercheck);
    try {
      await newuser.save();
      console.log("User created");
      return res.status(200).send({ message: "Success" });
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
  //console.log(user);
  if (!user || !(await user.verifyPassword(`${req.body.password}`))) {
    return res.status(401).send({ err: "Invalid Email or Password!" });
  } else {
    const token = user.generateAccessJWT();
    // console.log(token);
    res.cookie("sessionID", token, {
      maxAge: 20 * 60 * 1000, // Expiry time in milliseconds (e.g., 20 minutes)
      httpOnly: true, // Cookie accessible only by the server
    });

    return res.status(200).send({ sessionID: token, message: "OK" });
  }
});

router.get("/logout", async (req, res) => {
  try {
    const authHeader = req.headers["cookie"];
    const cookie = authHeader.split("=")[1];
    const checkIfBlackList = await BlackList.findOne({ token: cookie });
    if (checkIfBlackList) {
      res.status(204);
    }
    const newBlackList = new BlackList({ token: cookie });
    await newBlackList.save();
    res.setHeader("Clear-Site-Data", '"cookies"');
    res.status(200).send({ message: "Log Out successful" });
  } catch (err) {
    res.status(500).send({ message: "Server Error" });
  }
});

/*router.listen(8000, () =>
  console.log(`Server running on http://localhost:8000`)
);*/

app.use(router);

export default app;
