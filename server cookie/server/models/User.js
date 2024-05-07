import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN } from "../config/index.js";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: "Your firstname is required",
      max: 25,
    },
    last_name: {
      type: String,
      required: "Your lastname is required",
      max: 25,
    },
    email: {
      type: String,
      required: "Your email is required",
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: "Your password is required",
      select: false,
      max: 25,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    const hash = await bcrypt.hash(this.password, salt);
    // Set the hashed password
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.verifyPassword = async function (userpassword) {
  try {
    return await bcrypt.compare(userpassword, this.password);
  } catch (err) {
    return false;
  }
};

userSchema.methods.generateAccessJWT = function () {
  let payload = {
    id: this._id,
  };
  //console.log(SECRET_ACCESS_TOKEN);
  return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
    expiresIn: "20m",
  });
};

const User = mongoose.model("User", userSchema);

export default User;
