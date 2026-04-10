import { getAllTodos, createTodo } from "../store";
import type { Route } from "./+types/api.todos";

// GET /api/todos — list all todos
export async function loader(_: Route.LoaderArgs) {
  return Response.json(getAllTodos());
}

// POST /api/todos — create a todo
// Body: { "title": "..." }
export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title } = body as Record<string, unknown>;
  if (!title || typeof title !== "string" || !title.trim()) {
    return Response.json({ error: "title is required" }, { status: 422 });
  }

  const todo = createTodo(title.trim());
  return Response.json(todo, { status: 201 });
}
