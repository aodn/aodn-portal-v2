import { useState, useCallback } from "react";

interface UseClipboardReturn {
  copyToClipboard: (text: string, referenceId?: string) => Promise<void>;
  checkIsCopied: (text: string, referenceId?: string) => boolean;
  clearClipboard: () => Promise<void>;
}

const useClipboard = (): UseClipboardReturn => {
  const [clipboard, setClipboard] = useState<string | undefined>(undefined);

  // Copy text to clipboard
  const copyToClipboard = useCallback(
    async (text: string, referenceId?: string) => {
      try {
        await navigator.clipboard?.writeText(text);
        setClipboard(referenceId ? `${text}-${referenceId}` : text);
      } catch (error) {
        console.error("Failed to copy text: ", error);
      }
    },
    []
  );

  // Check if specific text is in clipboard
  const checkIsCopied = useCallback(
    (text: string, referenceId?: string) => {
      return clipboard === (referenceId ? `${text}-${referenceId}` : text);
    },
    [clipboard]
  );

  // Clear clipboard
  const clearClipboard = useCallback(async () => {
    try {
      await navigator.clipboard?.writeText("");
      setClipboard(undefined);
    } catch (error) {
      console.error("Failed to clear clipboard: ", error);
    }
  }, []);

  return {
    copyToClipboard,
    checkIsCopied,
    clearClipboard,
  };
};

export default useClipboard;
