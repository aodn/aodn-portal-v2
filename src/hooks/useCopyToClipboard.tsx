import { useState, useCallback } from "react";

interface UseCopyToClipboardProps {
  onCopySuccess?: () => void;
  onCopyError?: (error: unknown) => void;
}

interface UseCopyToClipboardReturn {
  isCopied: boolean;
  copyToClipboard: (text: string) => Promise<void>;
  resetCopyState: () => void;
}

const useCopyToClipboard = ({
  onCopySuccess,
  onCopyError,
}: UseCopyToClipboardProps = {}): UseCopyToClipboardReturn => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        onCopySuccess?.();
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

export default useCopyToClipboard;
