import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import app from './main.js';
import knex from "knex";
import knexfile from "./knexfile.js";

const server = express();
const db = knex(knexfile);

server.use(cors());
server.disable("x-powered-by"); //Reduce fingerprinting
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

server.use(app);

server.listen(8000, () => console.log(`Server running on http://localhost:8000`))