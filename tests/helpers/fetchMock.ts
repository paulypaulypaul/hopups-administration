import { vi } from "vitest";

export function mockFetchOnce(status: number, body: unknown): ReturnType<typeof vi.fn> {
  const fn = vi.fn(
    async () =>
      new Response(body === undefined ? null : JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" }
      })
  );
  vi.stubGlobal("fetch", fn);
  return fn;
}

export function mockFetchSequence(responses: { status: number; body?: unknown }[]): ReturnType<typeof vi.fn> {
  const fn = vi.fn();
  for (const r of responses) {
    fn.mockImplementationOnce(
      async () =>
        new Response(r.body === undefined ? null : JSON.stringify(r.body), {
          status: r.status,
          headers: { "Content-Type": "application/json" }
        })
    );
  }
  vi.stubGlobal("fetch", fn);
  return fn;
}
