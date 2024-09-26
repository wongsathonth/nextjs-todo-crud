import { connectToMongoDB } from "../../../../lib/mongoDb";
import { NextResponse } from "next/server";
import Todo from "../../../../models/todo";

export async function GET(req, { params }) {
  const { id } = params;
  await connectToMongoDB();
  const todo = await Todo.findById(id);
  return NextResponse.json({ todo }, { status: 200 });
}
export async function PATCH(req, { params }) {
  const { id } = params;
  const { completed } = await req.json();
  await connectToMongoDB();
  const todo = await Todo.findByIdAndUpdate(id, { completed });
  return NextResponse.json({ message: "Todo Update" }, { status: 200 });
}

export async function PUT(req, { params }) {
  const { id } = params;
  const { title, dueDate, description } = await req.json();
  await connectToMongoDB();
  const todo = await Todo.findByIdAndUpdate(id, {
    title,
    dueDate,
    description,
  });
  return NextResponse.json({ message: "Todo Update" }, { status: 200 });
}

export async function DELETE(req, { params }) {
  const { id } = params;
  await connectToMongoDB();
  const todo = await Todo.findByIdAndDelete(id);
  return NextResponse.json({ message: "Todo Delete" }, { status: 200 });
}