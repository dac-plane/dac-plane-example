import { useEffect, useRef, useState } from "react";
import type { Event } from "./api.ts";

export type StreamState = "connecting" | "open" | "reconnecting" | "closed";

export interface StreamHandlers {
  /** One lifecycle event, in cursor order. */
  onEvent: (event: Event) => void;
  /**
   * The server could not honour the cursor and restarted the stream. Whatever
   * was derived from earlier events must be read again, not assumed complete.
   */
  onReset: () => void;
}

// useEventStream follows a Surface API event stream with the browser's
// EventSource, which reconnects by itself and sends the last event's id as
// Last-Event-ID, so a dropped connection resumes where it stopped.
export function useEventStream(path: string | undefined, handlers: StreamHandlers): StreamState {
  const [state, setState] = useState<StreamState>("connecting");
  const latest = useRef(handlers);
  latest.current = handlers;

  useEffect(() => {
    if (!path) return;
    setState("connecting");
    const source = new EventSource(path);
    source.onopen = () => setState("open");
    source.onerror = () =>
      setState(source.readyState === EventSource.CLOSED ? "closed" : "reconnecting");
    source.addEventListener("lifecycle", (message) => {
      latest.current.onEvent(JSON.parse((message as MessageEvent<string>).data) as Event);
    });
    source.addEventListener("reset", () => latest.current.onReset());
    return () => source.close();
  }, [path]);

  return state;
}
