// Installed before any module under test is imported, because the Surface API
// client captures fetch when it is created. Each test sets `api.handle`.
type Handler = (request: Request) => Response | Promise<Response>;

export const api: { handle: Handler; requests: Request[] } = {
  handle: () => new Response("no handler", { status: 500 }),
  requests: [],
};

globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const request =
    typeof input === "object" && "method" in input && init === undefined
      ? input
      : new Request(new URL(String(input), window.location.href), init);
  api.requests.push(request.clone());
  return api.handle(request);
};

// jsdom has no EventSource. This one never opens, which leaves pages in
// their "connecting" state; streams are tested against the server instead.
class SilentEventSource extends EventTarget {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 2;
  readyState = 0;
  onopen: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(readonly url: string) {
    super();
  }
  close() {
    this.readyState = 2;
  }
}
globalThis.EventSource = SilentEventSource as unknown as typeof EventSource;
