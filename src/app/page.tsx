"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const updateComplateTodoStatus = async (id: string, status: boolean) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/todo/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !status }),
        cache: "no-store",
      });

      if (res.ok) {
        setTodos(
          todos.map((todo) =>
            todo._id === id ? { ...todo, completed: !status } : todo
          )
        );
      } else {
        console.log(`Failed to update todo status: ${res.status}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/todo/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });

      if (res.ok) {
        setTodos(todos.filter((todo) => todo._id !== id));
      } else {
        console.log(`Failed to delete todo: ${res.status}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getTodos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/todo/", {
        method: "GET",
        cache: "no-store",
      });
      const data = await res.json();

      if (res.ok) {
        setTodos(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  function formatDate(input: string): string {
    const date = new Date(input);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div>
      <div className="p-5 flex justify-end">
        <Link
          href="/create"
          className="bg-white px-4 py-2 rounded-md transition border border-gray-500 hover:bg-gray-900 hover:text-white"
        >
          Add Task
        </Link>
      </div>
      <div className="p-5 grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {todos.map((task) => (
          <div
            key={task._id}
            className="bg-white w-full p-6 border border-gray-400 rounded-lg shadow-xl"
          >
            <h1
              className={`text-3xl mb-2 font-semibold ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.title}
            </h1>
            <p className="mb-2 text-lg">{task.description}</p>
            <span className=" text-xs">
              Due Date: {formatDate(task.dueDate)}
            </span>
            <div className="flex justify-betweeen gap-3 mt-2">
              <button
                onClick={() =>
                  updateComplateTodoStatus(task._id, task.completed)
                }
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-md text-sm text-white flex-1 transition"
                type="button"
              >
                Done
              </button>
              <div className="flex-none flex gap-1">
                <Link
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md text-sm text-white transition"
                  href={`/edit/${task._id}`}
                >
                  Edit
                </Link>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm text-white transition"
                  onClick={() => deleteTodo(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}