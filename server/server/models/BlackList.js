import mongoose from "mongoose";
const BlackList = new mongoose.Schema(
  {
    token: { type: String, required: true, ref: "users" },
  },
  { timestamps: true }
);
export default mongoose.model("blacklist", BlackList);
