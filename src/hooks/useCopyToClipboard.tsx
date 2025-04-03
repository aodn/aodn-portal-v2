import { useState, useCallback } from "react";
import EventEmitter from "events";
import {
  ClipboardEvent,
  EVENT_CLIPBOARD,
} from "../components/map/mapbox/controls/menu/Definition";

interface UseCopyToClipboardProps {
  onCopySuccess?: () => void;
  onCopyError?: (error: unknown) => void;
}

interface UseCopyToClipboardReturn {
  isCopied: boolean;
  copyToClipboard: (text: string) => Promise<void>;
  resetCopyState: () => void;
}

const emitter = new EventEmitter();
emitter.setMaxListeners(50);

const on = (type: EVENT_CLIPBOARD, handle: (event: ClipboardEvent) => void) =>
  emitter.on(type, handle);

const off = (type: EVENT_CLIPBOARD, handle: (event: ClipboardEvent) => void) =>
  emitter.off(type, handle);

const useCopyToClipboard = ({
  onCopySuccess,
  onCopyError,
}: UseCopyToClipboardProps = {}): UseCopyToClipboardReturn => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard?.writeText(text);
        setIsCopied(true);
        onCopySuccess?.();
        emitter.emit(EVENT_CLIPBOARD.COPY, {
          action: EVENT_CLIPBOARD.COPY,
          value: text,
        });
      } catch (error) {
        setIsCopied(false);
        onCopyError?.(error);
        console.error("Failed to copy text: ", error);
      }
    },
    [onCopySuccess, onCopyError]
  );

  const resetCopyState = useCallback(() => {
    setIsCopied(false);
  }, []);

  return { isCopied, copyToClipboard, resetCopyState };
};

export { on, off };
export default useCopyToClipboard;
