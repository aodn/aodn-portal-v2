/**
 * Parses a single SSE event text block into its event type and typed data.
 * Returns null if the block is missing either field or the JSON is invalid.
 */
export const parseSSEEventText = <T = unknown>(
  eventText: string
): { eventType: string; data: T } | null => {
  const lines = eventText.split("\n");
  let eventType = "";
  let dataContent = "";

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("event:")) {
      eventType = trimmedLine.slice(6).trim();
    } else if (trimmedLine.startsWith("data:")) {
      dataContent = trimmedLine.slice(5).trim();
    }
  }

  if (!eventType || !dataContent) return null;

  try {
    return { eventType, data: JSON.parse(dataContent) as T };
  } catch {
    console.error("Failed to parse SSE event data:", dataContent);
    return null;
  }
};

/**
 * Consumes a ReadableStream of SSE data, calling onEvent for each complete event.
 * Handles buffering and double-newline boundary detection automatically.
 */
export const consumeSSEStream = async (
  stream: ReadableStream,
  onEvent: (eventType: string, data: unknown) => Promise<void>
): Promise<void> => {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let done = false;

  try {
    while (!done) {
      const result = await reader.read();
      done = result.done;
      if (done) break;

      buffer += decoder.decode(result.value, { stream: true });

      let eventStart = 0;
      while (eventStart < buffer.length) {
        const eventEnd = buffer.indexOf("\n\n", eventStart);
        if (eventEnd === -1) {
          buffer = buffer.slice(eventStart);
          break;
        }

        const eventText = buffer.slice(eventStart, eventEnd);
        if (eventText.trim()) {
          const parsed = parseSSEEventText(eventText);
          if (parsed) {
            await onEvent(parsed.eventType, parsed.data);
          }
        }

        eventStart = eventEnd + 2;
      }
    }
  } finally {
    await reader.cancel("Cleaning up SSE stream");
  }
};
