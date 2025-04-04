import { useState, useCallback } from "react";

interface UseCopyToClipboardReturn {
  isCopied: boolean;
  copyToClipboard: (text: string) => Promise<void>;
  resetCopyState: () => void;
}

const useCopyToClipboard = (): UseCopyToClipboardReturn => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard?.writeText(text);
      setIsCopied(true);
    } catch (error) {
      setIsCopied(false);

      console.error("Failed to copy text: ", error);
    }
  }, []);

  const resetCopyState = useCallback(() => {
    setIsCopied(false);
  }, []);

  return { isCopied, copyToClipboard, resetCopyState };
};

export default useCopyToClipboard;
