import { CosmosClient } from "@azure/cosmos";

export interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

const endpoint = process.env.COSMOS_ENDPOINT!;
const key = process.env.COSMOS_KEY!;
const databaseId = process.env.COSMOS_DATABASE ?? "TodoDatabase";
const containerId = process.env.COSMOS_CONTAINER ?? "Items";

// Singleton client — réutilisé entre les requêtes
let _container: ReturnType<ReturnType<CosmosClient["database"]>["container"]> | null = null;

function getContainer() {
  if (!_container) {
    const client = new CosmosClient({ endpoint, key });
    _container = client.database(databaseId).container(containerId);
  }
  return _container;
}

export async function getAllTodos(): Promise<Todo[]> {
  const { resources } = await getContainer()
    .items.query<Todo>("SELECT * FROM c ORDER BY c.createdAt ASC")
    .fetchAll();
  return resources;
}

export async function createTodo(title: string): Promise<Todo> {
  const todo: Todo = {
    id: crypto.randomUUID(),
    title,
    done: false,
    createdAt: new Date().toISOString(),
  };
  const { resource } = await getContainer().items.create<Todo>(todo);
  return resource!;
}

export async function getTodo(id: string): Promise<Todo | null> {
  try {
    const { resource } = await getContainer().item(id, id).read<Todo>();
    return resource ?? null;
  } catch {
    return null;
  }
}

export async function updateTodo(
  id: string,
  patch: Partial<Pick<Todo, "title" | "done">>
): Promise<Todo | null> {
  const todo = await getTodo(id);
  if (!todo) return null;
  const updated = { ...todo, ...patch };
  const { resource } = await getContainer().item(id, id).replace<Todo>(updated);
  return resource!;
}

export async function deleteTodo(id: string): Promise<boolean> {
  try {
    await getContainer().item(id, id).delete();
    return true;
  } catch {
    return false;
  }
}
