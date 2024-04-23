import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import appRouter from "./main.js";
import knex from "knex";
import knexfile from "./knexfile.js";
import session from "express-session";
import loginRouter from "./login.js";

const server = express();
const db = knex(knexfile);
//
//server.use(cors());
//server.disable("x-powered-by"); //Reduce fingerprinting
//server.use(cookieParser());
//server.use(express.urlencoded({ extended: false }));
//server.use(express.json());
//
server.set("view engine", "ejs");
server.use("/public", express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use((req, res, next) => {
  console.log("Incoming request", req.method, req.url);
  next();
});

server.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
server.use(appRouter);
server.use(loginRouter);

server.use((req, res) => {
  res.status(404);
  res.render("404error");
});

server.use((err, req, res, next) => {
  console.error(err);
  res.status(500);
  res.render("500error");
});

server.listen(8000, () =>
  console.log(`Server running on http://localhost:8000`)
);
