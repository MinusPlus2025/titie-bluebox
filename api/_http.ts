export interface ApiRequest {
  method?: string;
  body?: unknown;
}

export interface ApiResponse {
  status(code: number): ApiResponse;
  setHeader(name: string, value: string): void;
  json(body: unknown): unknown;
}

export function allow(response: ApiResponse, methods: readonly string[]): void {
  response.setHeader("Allow", methods.join(", "));
  response.setHeader("Cache-Control", "no-store");
}

export function badRequest(response: ApiResponse, error: unknown): unknown {
  const message = error instanceof Error ? error.message : "Invalid request";
  return response.status(400).json({ error: "INVALID_REQUEST", message });
}
