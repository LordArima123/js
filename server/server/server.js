import express from "express";
import appRouter from "./main.js";
import loginRouter from "./login.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import * as path from "path";
const __dirname = import.meta.dirname;

const server = express();
var corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
// server.set("view engine", "ejs");
// server.use("/public", express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(cors(corsOptions));

server.use(express.json());
server.use((req, res, next) => {
  console.log("Incoming request", req.method, req.url);
  next();
});

mongoose.promise = global.Promise;
mongoose.set("strictQuery", false);
try {
  await mongoose.connect("mongodb://localhost:27017/todos_list");
  console.log("Connected to Database");
} catch (err) {
  console.log("Error connect to Database", err);
}

server.use(express.static(path.join(__dirname, "public"), { index: false }));

server.use("/api", appRouter);
server.use("/api", loginRouter);

server.get("*", (req, res, next) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});
// server.use((req, res) => {
//   res.status(404);
// });

server.use((err, req, res, next) => {
  console.error(err);
  res.status(500);
});

server.listen(8000, () =>
  console.log(`Server running on http://localhost:8000`)
);
