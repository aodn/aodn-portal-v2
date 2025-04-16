import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import CopyButton from "../CopyButton";

describe("CopyLinkButton", () => {
  const mockText = "mock-text-123";
  const defaultProps = {
    handleClick: vi.fn(),
    hasBeenCopied: false,
    copyText: mockText,
    copyButtonConfig: {
      textBeforeCopy: "Copy Link",
      textAfterCopy: "Link Copied",
    },
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with initial state", () => {
    render(<CopyButton {...defaultProps} />);

    const button = screen.getByTestId(`copy-button-${mockText}`);
    expect(button).toBeInTheDocument();
    expect(screen.getByText("Copy Link")).toBeInTheDocument();
    expect(screen.queryByTestId("ContentCopyIcon")).toBeInTheDocument();
    expect(screen.queryByTestId("DoneAllIcon")).not.toBeInTheDocument();
  });

  it("calls handleClick with correct URL when clicked", () => {
    render(<CopyButton {...defaultProps} />);

    const button = screen.getByTestId(`copy-button-${mockText}`);
    userEvent.click(button);
    waitFor(() => {
      expect(defaultProps.handleClick).toHaveBeenCalledTimes(1);
    });
  });

  it("displays copied state when hasBeenCopied is true", () => {
    render(<CopyButton {...defaultProps} hasBeenCopied={true} />);

    expect(screen.getByText("Link Copied")).toBeInTheDocument();
    expect(screen.queryByTestId("DoneAllIcon")).toBeInTheDocument();
    expect(screen.queryByTestId("ContentCopyIcon")).not.toBeInTheDocument();
  });
});
