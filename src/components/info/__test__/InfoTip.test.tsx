import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import InfoTip from "../InfoTip";
import { InfoContentType } from "../InfoDefinition";

// Mock the scroll utilities
vi.mock("../../../utils/ScrollUtils", () => ({
  disableScroll: vi.fn(),
  enableScroll: vi.fn(),
}));

describe("InfoTip", () => {
  const mockInfoContent: InfoContentType = {
    title: "Test Info Title",
    body: "This is a test body content for the info tip component.",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the info icon button", () => {
    render(<InfoTip infoContent={mockInfoContent} />);

    const iconButton = screen.getByTestId("Info-tip-icon");
    expect(iconButton).toBeInTheDocument();
  });

  it("opens popover when icon button is clicked", async () => {
    const user = userEvent.setup();
    render(<InfoTip infoContent={mockInfoContent} />);

    const iconButton = screen.getByTestId("Info-tip-icon");
    await user.click(iconButton);

    expect(await screen.findByTestId("Info-tip-popup")).toBeInTheDocument();
    expect(
      screen.getByText(mockInfoContent.title as string)
    ).toBeInTheDocument();
    expect(screen.getByText(mockInfoContent.body)).toBeInTheDocument();
  });

  it("closes popover when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<InfoTip infoContent={mockInfoContent} />);

    const iconButton = screen.getByTestId("Info-tip-icon");
    await user.click(iconButton);
    expect(await screen.findByTestId("Info-tip-popup")).toBeInTheDocument();

    const closeButton = screen.getByTestId("Info-tip-close-button");
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId("Info-tip-popup")).not.toBeInTheDocument();
    });
  });

  it("closes popover when clicking outside (onClose)", async () => {
    const user = userEvent.setup();
    render(<InfoTip infoContent={mockInfoContent} />);

    const iconButton = screen.getByTestId("Info-tip-icon");
    await user.click(iconButton);
    expect(await screen.findByTestId("Info-tip-popup")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByTestId("Info-tip-popup")).not.toBeInTheDocument();
    });
  });
});
