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
