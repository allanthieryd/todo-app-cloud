import { getTodo, updateTodo, deleteTodo } from "../store";
import type { Route } from "./+types/api.todos.$id";

// GET /api/todos/:id — get a single todo
export async function loader({ params }: Route.LoaderArgs) {
  const todo = await getTodo(params.id);
  if (!todo) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(todo);
}

// PATCH /api/todos/:id — update title and/or done state
// Body: { "title"?: "...", "done"?: true|false }
//
// DELETE /api/todos/:id — delete a todo
export async function action({ request, params }: Route.ActionArgs) {
  if (request.method === "DELETE") {
    const deleted = await deleteTodo(params.id);
    if (!deleted) return Response.json({ error: "Not found" }, { status: 404 });
    return new Response(null, { status: 204 });
  }

  if (request.method === "PATCH") {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { title, done } = body as Record<string, unknown>;

    if (title !== undefined && (typeof title !== "string" || !title.trim())) {
      return Response.json({ error: "title must be a non-empty string" }, { status: 422 });
    }
    if (done !== undefined && typeof done !== "boolean") {
      return Response.json({ error: "done must be a boolean" }, { status: 422 });
    }

    const patch: Record<string, unknown> = {};
    if (title !== undefined) patch.title = (title as string).trim();
    if (done !== undefined) patch.done = done;

    const updated = await updateTodo(params.id, patch as { title?: string; done?: boolean });
    if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(updated);
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
