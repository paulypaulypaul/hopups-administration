export interface ApiClientConfig {
  getToken: () => string | null;
  onUnauthorized: () => void;
}

let config: ApiClientConfig = {
  getToken: () => null,
  onUnauthorized: () => {}
};

export function configureApiClient(next: ApiClientConfig): void {
  config = next;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export interface ApiRequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = config.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  if (response.status === 401 && auth) {
    config.onUnauthorized();
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}) as { error?: string });
    throw new ApiError(response.status, data.error ?? `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
