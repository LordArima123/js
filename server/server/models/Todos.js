import mongoose from "mongoose";

const TodosList = new mongoose.Schema({
  title: String,
  status: Boolean,
  piority: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  userid: {
    type: String,
    required: true,
  },
});

const Todos = mongoose.model("Todos", TodosList);

export default Todos;
