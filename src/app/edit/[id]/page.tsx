"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Page({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [styleAlert, setStyleAlert] = useState<"success" | "error" | "">("");
  const [textAlert, setTextAlert] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  function formatDate(input: string): string {
    const date = new Date(input);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const getTodo = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/todo/${params.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (res.ok) {
        const data = await res.json();
        setTitle(data.todo.title);
        setDescription(data.todo.description);
        setDueDate(formatDate(data.todo.dueDate));
      } else {
        console.log("fetch to fetch post");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title && !dueDate) {
      alert("pls complate all input");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/todo/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, dueDate, description }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setStyleAlert("success");
        setTextAlert(data.message);
      } else {
        setStyleAlert("error");
        setTextAlert(data.message || "An error occurred.");
      }
    } catch (error: unknown) {
      setStyleAlert("error");
      setTextAlert("An unexpected error occurred.");
    }
    setLoading(false);
  };

  useEffect(() => {
    getTodo();
  }, [params.id]);
  return (
    <div>
      {styleAlert === "success" && (
        <div className="block text-green-700 bg-green-100 border border-green-300 rounded-lg p-3 mb-4">
          {textAlert}
        </div>
      )}

      {styleAlert === "error" && (
        <div className="block text-red-700 bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
          {textAlert}
        </div>
      )}

      <Link
        className="px-4 py-2 rounded-md transition border border-gray-500 hover:bg-gray-900 hover:text-white"
        href="/"
      >
        Back
      </Link>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1 my-4">
          <label htmlFor="todo">Todo</label>
          <input
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            name="todo"
            className="border border-gray-900 w-full p-3 rounded-md"
            type="text"
            placeholder="Add new Todo"
            value={title}
          />
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <label htmlFor="description">Description</label>
          <textarea
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            name="description"
            className="border border-gray-900 w-full p-3 rounded-md"
            placeholder="Add New Todo description"
            value={description}
            rows={5}
          >
            {" "}
          </textarea>
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <label htmlFor="dueDate">DueDate</label>
          <input
            className="border border-gray-900 w-full p-3 rounded-md"
            type="date"
            name="dueDate"
            onChange={(e) => {
              setDueDate(e.target.value);
            }}
            value={dueDate}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition text-white flex justify-center items-center gap-2 ${
              loading ? "opacity-75" : ""
            }`}
          >
            {loading ? (
              <svg
                aria-hidden="true"
                className="size-4 text-gray-200 animate-spin fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            ) : (
              ""
            )}{" "}
            Edit
          </button>
        </div>
      </form>
    </div>
  );
}