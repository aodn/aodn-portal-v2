import { createContext, useContext } from "react";

export interface ClipboardContextType {
  copyToClipboard: (text: string, referenceId?: string) => Promise<void>;
  checkIsCopied: (text: string, referenceId?: string) => boolean;
  clearClipboard: () => Promise<void>;
}

const clipboardContextTypeDefault: ClipboardContextType = {
  copyToClipboard: async () => {},
  checkIsCopied: () => false,
  clearClipboard: async () => {},
};

export const ClipboardContext = createContext<ClipboardContextType>(
  clipboardContextTypeDefault
);

export const useClipboardContext = () => useContext(ClipboardContext);
