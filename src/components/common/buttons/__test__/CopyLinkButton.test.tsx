import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CopyLinkButton from "../CopyLinkButton";
import { color } from "../../../../styles/constants"; // Adjust path as needed

describe("CopyLinkButton", () => {
  const defaultProps = {
    index: 1,
    copyUrl: "https://example.com/1",
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with initial state", () => {
    render(<CopyLinkButton {...defaultProps} index={1} />);
    const button = screen.getByTestId("copylinkbutton-copybutton-1");
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle("background-color: #fff");
    expect(screen.getByText("Copy Link")).toBeInTheDocument();
    expect(
      screen.queryByTestId("copylinkbutton-doneicon-1")
    ).not.toBeInTheDocument();
  });

  it("copies URL and updates state on click", () => {
    const mockSetClicked = vi.fn();
    render(
      <CopyLinkButton
        {...defaultProps}
        setClickedCopyLinkButtonIndex={mockSetClicked}
        index={1}
      />
    );

    const button = screen.getByTestId("copylinkbutton-copybutton-1");
    fireEvent.click(button);

    waitFor(() =>
      expect(mockSetClicked).toHaveBeenCalledWith(expect.any(Function))
    ).then(() => {
      console.log("Verify clicked");
      // color.blue.light
      expect(button).toHaveStyle(`background-color: ${color.blue.light}`);
      // Give it some time to refresh so wrap it with waitFor
      waitFor(() =>
        expect(
          screen.getByTestId("copylinkbutton-doneicon-1")
        ).toBeInTheDocument()
      );
    });
  });

  it("resets isCopied when another copy event occurs", () => {
    const url1 = "https://example1.com/";
    const url2 = "https://example2.com/";

    render(
      <>
        <CopyLinkButton {...defaultProps} index={1} copyUrl={url1} />
        <CopyLinkButton {...defaultProps} index={2} copyUrl={url2} />
      </>
    );

    const button1 = screen.getByTestId("copylinkbutton-copybutton-1");
    const button2 = screen.getByTestId("copylinkbutton-copybutton-2");

    fireEvent.click(button1);

    waitFor(() => {
      expect(button1).toHaveStyle(`background-color: ${color.blue.light}`);
    }).then(() => {
      // Now click on the second button
      fireEvent.click(button2);
      // The color of second button changed, and then the first button status reset
      waitFor(() =>
        expect(button2).toHaveStyle(`background-color: ${color.blue.light}`)
      ).then(() => {
        expect(button1).toHaveStyle("background-color: #fff");
      });
    });
  });
});
