import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import LinkCard from "../LinkCard";
import { ILink } from "../../../../common/store/OGCCollectionDefinitions";
import * as ClipboardContext from "../../../../../context/clipboard/ClipboardContext";
import * as LinkUtils from "../../../../../utils/LinkUtils";

vi.mock("../../../../../context/clipboard/ClipboardContext", () => ({
  useClipboardContext: vi.fn(),
}));

vi.mock("../../../../../utils/LinkUtils", () => ({
  openInNewTab: vi.fn(),
}));

vi.mock("../../../../../hooks/useBreakpoint", () => ({
  default: () => ({ isUnderLaptop: false }),
}));

describe("LinkCard", () => {
  const mockLink: ILink = {
    href: "https://example.com/test-link",
    rel: "test",
    title: "Test_Link_Title",
    description: "A test link for unit testing",
    type: "text/html",
    getIcon: vi.fn().mockReturnValue("/test-icon.svg"),
  };

  const mockCopyToClipboard = vi.fn();
  const mockCheckIsCopied = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(ClipboardContext.useClipboardContext).mockReturnValue({
      checkIsCopied: mockCheckIsCopied,
      copyToClipboard: mockCopyToClipboard,
      clearClipboard: vi.fn(),
    });
  });

  it("renders with title by default", () => {
    render(<LinkCard link={mockLink} />);

    // Should render title with underscores replaced
    expect(
      screen.getByText("Test Link Title", { exact: false })
    ).toBeInTheDocument();

    // The component only shows the title, not the description
    expect(
      screen.queryByText("A test link for unit testing", { exact: false })
    ).not.toBeInTheDocument();
  });

  it("renders only title when description is missing", () => {
    const linkWithoutDescription = { ...mockLink, description: undefined };
    render(<LinkCard link={linkWithoutDescription} />);

    // Should only render title if no description is provided
    expect(
      screen.getByText("Test Link Title", { exact: false })
    ).toBeInTheDocument();
  });

  it("shows copy button on hover when link has not been copied", () => {
    mockCheckIsCopied.mockReturnValue(false);

    render(<LinkCard link={mockLink} />);

    const linkCard = screen.getByTestId(`link-card-${mockLink.href}`);

    // Initially copy button should not be visible
    expect(
      screen.queryByTestId(`copy-button-${mockLink.href}`)
    ).not.toBeInTheDocument();

    // Hover on the card
    userEvent.hover(linkCard);
    return waitFor(() => {
      const copyButton = screen.queryByTestId(`copy-button-${mockLink.href}`);
      expect(copyButton).toBeInTheDocument();
    }).then(() => {
      // Mouse leave
      userEvent.unhover(linkCard);
      return waitFor(() => {
        const copyButton = screen.queryByTestId(`copy-button-${mockLink.href}`);
        expect(copyButton).not.toBeInTheDocument();
      });
    });
  });

  it("shows copy button when link has been copied", () => {
    mockCheckIsCopied.mockReturnValue(true);

    render(<LinkCard link={mockLink} />);

    // Wait for the button to be visible when link has been copied
    return waitFor(() => {
      const copyButton = screen.queryByTestId(`copy-button-${mockLink.href}`);
      expect(copyButton).toBeInTheDocument();
    });
  });

  it("calls openInNewTab when link is clicked", () => {
    render(<LinkCard link={mockLink} />);

    const link = screen.getByText("Test Link Title", { exact: false });
    userEvent.click(link);
    return waitFor(
      () => {
        expect(LinkUtils.openInNewTab).toHaveBeenCalledWith(mockLink.href);
      },
      { timeout: 5000 }
    );
  });

  it("calls copyToClipboard with correct URL when copy button is clicked", () => {
    mockCheckIsCopied.mockReturnValue(false);

    render(<LinkCard link={mockLink} />);

    const linkCard = screen.getByTestId(`link-card-${mockLink.href}`);
    userEvent.hover(linkCard);

    return waitFor(() => {
      return screen.getByTestId(`copy-button-${mockLink.href}`);
    }).then((copyButton) => {
      userEvent.click(copyButton);

      return waitFor(() => {
        expect(mockCopyToClipboard).toHaveBeenCalledWith(
          mockLink.href,
          mockLink.title
        );
      });
    });
  });
});
