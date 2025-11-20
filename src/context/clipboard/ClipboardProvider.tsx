import { FC, ReactNode, useState, useCallback } from "react";
import { ClipboardContext, ClipboardContextType } from "./ClipboardContext";

interface ClipboardProviderProps {
  children: ReactNode;
}

export const ClipboardProvider: FC<ClipboardProviderProps> = ({ children }) => {
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

  const value: ClipboardContextType = {
    copyToClipboard,
    checkIsCopied,
    clearClipboard,
  };

  return (
    <ClipboardContext.Provider value={value}>
      {children}
    </ClipboardContext.Provider>
  );
};
