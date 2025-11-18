import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import CopyButton from "../CopyButton";
import * as ClipboardContext from "../../../../context/clipboard/ClipboardContext";

vi.mock("../../../../context/clipboard/ClipboardContext", () => ({
  useClipboardContext: vi.fn(),
}));

describe("CopyButton", () => {
  const mockText = "mock-text-123";
  const mockCopyToClipboard = vi.fn();
  const mockCheckIsCopied = vi.fn();
  const mockOnCopy = vi.fn();

  const defaultProps = {
    copyText: mockText,
    copyButtonConfig: {
      tooltipText: ["Copy Link", "Link Copied"],
      onCopy: mockOnCopy,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(ClipboardContext.useClipboardContext).mockReturnValue({
      copyToClipboard: mockCopyToClipboard,
      checkIsCopied: mockCheckIsCopied,
      clearClipboard: vi.fn(),
    });
  });

  it("renders correctly with initial state", () => {
    mockCheckIsCopied.mockReturnValue(false);

    render(<CopyButton {...defaultProps} />);

    const button = screen.getByTestId(`copy-button-${mockText}`);
    expect(button).toBeInTheDocument();

    // Check for tooltip text by hovering over the button
    userEvent.hover(button);
    return waitFor(() => {
      expect(screen.getByText("Copy Link")).toBeInTheDocument();
    }).then(() => {
      expect(screen.queryByTestId("ContentCopyIcon")).toBeInTheDocument();
      expect(screen.queryByTestId("DoneAllIcon")).not.toBeInTheDocument();
    });
  });

  it("calls copyToClipboard and onCopy when clicked", () => {
    mockCheckIsCopied.mockReturnValue(false);

    render(<CopyButton {...defaultProps} />);

    const button = screen.getByTestId(`copy-button-${mockText}`);
    userEvent.click(button);

    return waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalledWith(mockText, "");
    }).then(() => {
      expect(mockOnCopy).toHaveBeenCalledTimes(1);
    });
  });

  it("displays copied state when item has been copied", () => {
    mockCheckIsCopied.mockReturnValue(true);

    render(<CopyButton {...defaultProps} />);

    const button = screen.getByTestId(`copy-button-${mockText}`);

    // Check for tooltip text by hovering over the button
    userEvent.hover(button);
    return waitFor(() => {
      expect(screen.getByText("Link Copied")).toBeInTheDocument();
    }).then(() => {
      expect(screen.queryByTestId("DoneAllIcon")).toBeInTheDocument();
      expect(screen.queryByTestId("ContentCopyIcon")).not.toBeInTheDocument();
    });
  });
});
