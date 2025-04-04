import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import CopyLinkButton from "../CopyLinkButton";
import { color } from "../../../../styles/constants";
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

    // Should show ContentCopy icon initially
    expect(screen.queryByTestId("ContentCopyIcon")).toBeInTheDocument();
    // DoneAll icon should not be visible initially
    expect(screen.queryByTestId("DoneAllIcon")).not.toBeInTheDocument();
  });

  it("calls handleClick with correct URL when clicked", async () => {
    // Create a user event instance
    const user = userEvent.setup();

    render(<CopyLinkButton {...defaultProps} />);

    const button = screen.getByTestId(`copylinkbutton-${mockUrl}`);

    // Wait for the click to complete
    await user.click(button);

    expect(defaultProps.handleClick).toHaveBeenCalledWith(mockUrl);
  });

  it("displays copied state when hasBeenCopied is true", () => {
    render(<CopyLinkButton {...defaultProps} hasBeenCopied={true} />);

    const button = screen.getByTestId(`copylinkbutton-${mockUrl}`);
    expect(button).toHaveStyle(`background-color: ${color.blue.light}`);

    // Should show DoneAll icon when copied
    expect(screen.queryByTestId("DoneAllIcon")).toBeInTheDocument();
    // ContentCopy icon should not be visible
    expect(screen.queryByTestId("ContentCopyIcon")).not.toBeInTheDocument();
  });
});
