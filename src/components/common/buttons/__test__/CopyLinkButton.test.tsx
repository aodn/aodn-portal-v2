import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import CopyLinkButton from "../CopyLinkButton";

describe("CopyLinkButton", () => {
  const mockUrl = "https://example.com/test";
  const defaultProps = {
    handleClick: vi.fn(),
    hasBeenCopied: false,
    copyUrl: mockUrl,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with initial state", () => {
    render(<CopyLinkButton {...defaultProps} />);

    const button = screen.getByTestId(`copylinkbutton-${mockUrl}`);
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle("background-color: #fff");
    expect(screen.getByText("Copy Link")).toBeInTheDocument();

    expect(screen.queryByTestId("ContentCopyIcon")).toBeInTheDocument();
    expect(screen.queryByTestId("DoneAllIcon")).not.toBeInTheDocument();
  });

  it("calls handleClick with correct URL when clicked", async () => {
    const user = userEvent.setup();
    render(<CopyLinkButton {...defaultProps} />);

    const button = screen.getByTestId(`copylinkbutton-${mockUrl}`);
    await user.click(button);

    await waitFor(() => {
      expect(defaultProps.handleClick).toHaveBeenCalledWith(mockUrl);
    });
  });

  it("displays copied state when hasBeenCopied is true", () => {
    render(<CopyLinkButton {...defaultProps} hasBeenCopied={true} />);

    expect(screen.queryByTestId("DoneAllIcon")).toBeInTheDocument();
    expect(screen.queryByTestId("ContentCopyIcon")).not.toBeInTheDocument();
  });
});
