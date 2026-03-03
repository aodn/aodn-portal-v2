import { describe, expect, it, vi } from "vitest";
import { parseSSEEventText, consumeSSEStream } from "../SSEUtils";

const makeStream = (...chunks: string[]): ReadableStream => {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
};

describe("parseSSEEventText", () => {
  it("parses a valid SSE event block", () => {
    const text = 'event: connection-established\ndata: {"status":"connected"}';
    expect(parseSSEEventText(text)).toEqual({
      eventType: "connection-established",
      data: { status: "connected" },
    });
  });

  it("returns null when the event field is missing", () => {
    const text = 'data: {"status":"connected"}';
    expect(parseSSEEventText(text)).toBeNull();
  });

  it("returns null when the data field is missing", () => {
    const text = "event: connection-established";
    expect(parseSSEEventText(text)).toBeNull();
  });

  it("returns null for invalid JSON in the data field", () => {
    const text = "event: connection-established\ndata: not-valid-json";
    expect(parseSSEEventText(text)).toBeNull();
  });

  it("trims whitespace from event type and data value", () => {
    const text = 'event:  my-event  \ndata:  {"key":"value"}  ';
    const result = parseSSEEventText(text);
    expect(result?.eventType).toBe("my-event");
    expect(result?.data).toEqual({ key: "value" });
  });

  it("parses numeric values in the data payload", () => {
    const text = 'event: estimate-complete\ndata: {"size":236231682}';
    const result = parseSSEEventText<{ size: number }>(text);
    expect(result?.eventType).toBe("estimate-complete");
    expect(result?.data.size).toBe(236231682);
  });
});

describe("consumeSSEStream", () => {
  it("calls onEvent once for a single complete event", async () => {
    const stream = makeStream(
      'event: connection-established\ndata: {"status":"connected"}\n\n'
    );
    const onEvent = vi.fn().mockResolvedValue(undefined);

    await consumeSSEStream(stream, onEvent);

    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent).toHaveBeenCalledWith("connection-established", {
      status: "connected",
    });
  });

  it("calls onEvent for each event when multiple events arrive in one chunk", async () => {
    const stream = makeStream(
      'event: event-one\ndata: {"n":1}\n\nevent: event-two\ndata: {"n":2}\n\n'
    );
    const onEvent = vi.fn().mockResolvedValue(undefined);

    await consumeSSEStream(stream, onEvent);

    expect(onEvent).toHaveBeenCalledTimes(2);
    expect(onEvent).toHaveBeenNthCalledWith(1, "event-one", { n: 1 });
    expect(onEvent).toHaveBeenNthCalledWith(2, "event-two", { n: 2 });
  });

  it("handles an event split across multiple chunks", async () => {
    const stream = makeStream("event: my-event\n", 'data: {"split":true}\n\n');
    const onEvent = vi.fn().mockResolvedValue(undefined);

    await consumeSSEStream(stream, onEvent);

    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent).toHaveBeenCalledWith("my-event", { split: true });
  });

  it("skips empty or whitespace-only event blocks", async () => {
    const stream = makeStream(
      '\n\n   \n\nevent: real-event\ndata: {"ok":true}\n\n'
    );
    const onEvent = vi.fn().mockResolvedValue(undefined);

    await consumeSSEStream(stream, onEvent);

    expect(onEvent).toHaveBeenCalledOnce();
    expect(onEvent).toHaveBeenCalledWith("real-event", { ok: true });
  });

  it("skips event blocks with invalid JSON and does not call onEvent", async () => {
    const stream = makeStream("event: bad-event\ndata: not-json\n\n");
    const onEvent = vi.fn().mockResolvedValue(undefined);

    await consumeSSEStream(stream, onEvent);

    expect(onEvent).not.toHaveBeenCalled();
  });

  it("does not call onEvent for an empty stream", async () => {
    const stream = makeStream();
    const onEvent = vi.fn().mockResolvedValue(undefined);

    await consumeSSEStream(stream, onEvent);

    expect(onEvent).not.toHaveBeenCalled();
  });
});
