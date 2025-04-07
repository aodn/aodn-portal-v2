import { useState, useCallback, useEffect } from "react";

interface UseClipboardReturn {
  clipboardText: string | undefined;
  copyToClipboard: (text: string) => Promise<void>;
  checkIfCopied: (text: string) => boolean;
  clearClipboard: () => Promise<void>;
}

const useClipboard = (): UseClipboardReturn => {
  const [clipboardText, setClipboardText] = useState<string | undefined>(
    undefined
  );

  // Helper to read from clipboard
  const readFromClipboard = useCallback(async () => {
    try {
      if (!navigator.clipboard) {
        // TODO: throw new Error("Clipboard API not available");
        return undefined;
      }
      const text = await navigator.clipboard.readText();
      setClipboardText(text);
      return text;
    } catch (error) {
      console.error("Failed to read from clipboard: ", error);
      return undefined;
    }
  }, []);

  // Initialize clipboard text on mount
  useEffect(() => {
    readFromClipboard();
  }, [readFromClipboard]);

  // Copy text to clipboard
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard?.writeText(text);
      setClipboardText(text);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  }, []);

  // Check if specific text is in clipboard
  const checkIfCopied = useCallback(
    (text: string) => {
      return clipboardText === text;
    },
    [clipboardText]
  );

  // Clear clipboard
  const clearClipboard = useCallback(async () => {
    try {
      await navigator.clipboard?.writeText("");
      setClipboardText(undefined);
    } catch (error) {
      console.error("Failed to clear clipboard: ", error);
    }
  }, []);

  return {
    clipboardText,
    copyToClipboard,
    checkIfCopied,
    clearClipboard,
  };
};

export default useClipboard;
