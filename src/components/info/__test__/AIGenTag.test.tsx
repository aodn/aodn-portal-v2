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
    // jsdom does not implement scrollTo; enableScroll calls it on close.
    window.scrollTo = vi.fn();
  });

  it("renders the AI icon button", () => {
    render(<AIGenTag infoContent={mockInfoContent} />);

    const iconButton = screen.getByTestId("AIGenTag-icon");
    expect(iconButton).toBeInTheDocument();
  });

  it("opens popover when icon button is clicked", async () => {
    render(<AIGenTag infoContent={mockInfoContent} />);

    const iconButton = screen.getByTestId("AIGenTag-icon");
    await userEvent.click(iconButton);

    expect(await screen.findByTestId("AIGenTag-popup")).toBeInTheDocument();
    expect(
      screen.getByText(mockInfoContent.title as string)
    ).toBeInTheDocument();
    expect(screen.getByText(mockInfoContent.body)).toBeInTheDocument();
  });

  it("closes popover when close button is clicked", async () => {
    render(<AIGenTag infoContent={mockInfoContent} />);

    const iconButton = screen.getByTestId("AIGenTag-icon");
    await userEvent.click(iconButton);
    expect(await screen.findByTestId("AIGenTag-popup")).toBeInTheDocument();

    const closeButton = screen.getByTestId("AIGenTag-close-button");
    await userEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId("AIGenTag-popup")).not.toBeInTheDocument();
    });
  });
});
