import express from "express";
import knex from "knex";
import knexfile from "./knexfile.js";
import bcrypt from "bcrypt";
import createUser from './models/Usermodels.js';

const app = express();
const db = knex(knexfile);
const saltRounds = 10;



app.set("view engine", "ejs");

app.use("/public", express.static("public"));

app.use(express.urlencoded({ extended: true }));



app.use((req, res, next) => {
  console.log("Incomming request", req.method, req.url);
  next();
});

app.get("/", async (req, res) => {
    res.render("login")
});


app.get("/register", async (req, res) => {
    res.render("register");
});



app.post("/registernew", async (req, res) => {
    
    const users = await db('user').select("*")
    const newuser = {
        firstname:req.body.firstName,
        lastname:req.body.lastName,
        email:req.body.iemail,
        password: req.body.password,
    };
    console.log(users);
    const usercheck =users.find((usercheck)=>{
        return usercheck.email == newuser.email;
    });
    if(usercheck) {
        return res.render("warn",{
            message: "Email Existed!",
            returnl:"register"
    });
    }else{
        console.log(usercheck);
        try {
            await createUser(newuser);
            console.log('User created')
        } catch(err){
            console.error(err);
        }
    }
    
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
  
  app.listen(5000, () => {
    console.log("Server listening on http://localhost:5000");
  });