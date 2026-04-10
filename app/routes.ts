import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/todos", "routes/api.todos.tsx"),
  route("api/todos/:id", "routes/api.todos.$id.tsx"),
] satisfies RouteConfig;
