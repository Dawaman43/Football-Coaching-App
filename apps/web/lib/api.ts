export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`/api/backend${path}`, { method: "GET" });
  if (!res.ok) {
    throw new Error("Request failed");
  }
  return res.json() as Promise<T>;
}

export async function apiSend<T>(path: string, body: unknown, method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST"): Promise<T> {
  const res = await fetch(`/api/backend${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error("Request failed");
  }
  return res.json() as Promise<T>;
}
