import { useState } from "react";
import { useLoaderData } from "react-router";
import { getAllTodos, type Todo } from "../store";
import type { Route } from "./+types/home";

export function meta() {
  return [{ title: "Todo App" }];
}

export async function loader(_: Route.LoaderArgs) {
  return getAllTodos();
}

export default function Home() {
  const initial = useLoaderData<typeof loader>();
  const [todos, setTodos] = useState<Todo[]>(initial);
  const [input, setInput] = useState("");

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    const title = input.trim();
    if (!title) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const todo: Todo = await res.json();
    setTodos((prev) => [...prev, todo]);
    setInput("");
  }

  async function toggleDone(todo: Todo) {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    });
    const updated: Todo = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  async function deleteTodo(id: string) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>Todo App</h1>

      <form onSubmit={addTodo} style={styles.form}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nouvelle tâche..."
        />
        <button type="submit" style={styles.btnAdd}>Ajouter</button>
      </form>

      {todos.length === 0 && (
        <p style={{ color: "#888" }}>Aucune tâche pour l'instant.</p>
      )}

      <ul style={styles.list}>
        {todos.map((todo) => (
          <li key={todo.id} style={styles.item}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleDone(todo)}
              style={{ cursor: "pointer", width: 18, height: 18 }}
            />
            <span style={{ ...styles.title, textDecoration: todo.done ? "line-through" : "none", color: todo.done ? "#fef" : "#fff" }}>
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)} style={styles.btnDelete}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}

const styles = {
  main: {
    fontFamily: "system-ui, sans-serif",
    maxWidth: 560,
    margin: "3rem auto",
    padding: "0 1rem",
  } as React.CSSProperties,
  h1: { marginBottom: "1.5rem" } as React.CSSProperties,
  form: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem" } as React.CSSProperties,
  input: {
    flex: 1,
    padding: "0.5rem 0.75rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: 6,
  } as React.CSSProperties,
  btnAdd: {
    padding: "0.5rem 1rem",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: "1rem",
  } as React.CSSProperties,
  list: { listStyle: "none", padding: 0, margin: 0 } as React.CSSProperties,
  item: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.6rem 0",
    borderBottom: "1px solid #eee",
  } as React.CSSProperties,
  title: { flex: 1, fontSize: "1rem" } as React.CSSProperties,
  btnDelete: {
    padding: "0.3rem 0.7rem",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: "0.85rem",
  } as React.CSSProperties,
};
