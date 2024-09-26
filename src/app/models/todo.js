import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);
export default Todo;