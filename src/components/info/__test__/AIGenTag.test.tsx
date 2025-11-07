import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import AIGenTag from "../AIGenTag";
import { InfoContentType } from "../InfoDefinition";

describe("AIGenTag", () => {
  const mockInfoContent: InfoContentType = {
    title: "Test AI Generated Title",
    body: "This is a test body content for the AI generated tag.",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the AI icon button", () => {
    render(<AIGenTag infoContent={mockInfoContent} />);

    const iconButton = screen.getByTestId("AIGenTag-icon");
    expect(iconButton).toBeInTheDocument();
  });

  it("opens popover when icon button is clicked", () => {
    render(<AIGenTag infoContent={mockInfoContent} />);

    const iconButton = screen.getByTestId("AIGenTag-icon");
    userEvent.click(iconButton);

    return waitFor(() => {
      expect(screen.getByTestId("AIGenTag-popup")).toBeInTheDocument();
    }).then(() => {
      expect(
        screen.getByText(mockInfoContent.title as string)
      ).toBeInTheDocument();
      expect(screen.getByText(mockInfoContent.body)).toBeInTheDocument();
    });
  });

  it("closes popover when close button is clicked", () => {
    render(<AIGenTag infoContent={mockInfoContent} />);

    // Open the popover
    const iconButton = screen.getByTestId("AIGenTag-icon");
    userEvent.click(iconButton);

    return waitFor(() => {
      expect(screen.getByTestId("AIGenTag-popup")).toBeInTheDocument();
    }).then(() => {
      // Close the popover
      const closeButton = screen.getByTestId("AIGenTag-close-button");
      userEvent.click(closeButton);

      return waitFor(() => {
        expect(screen.queryByTestId("AIGenTag-popup")).not.toBeInTheDocument();
      });
    });
  });
});
