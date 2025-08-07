import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import LinkCard from "../LinkCard";
import { ILink } from "../../../../common/store/OGCCollectionDefinitions";
import * as DetailPageContext from "../../../../../pages/detail-page/context/detail-page-context";
import * as LinkUtils from "../../../../../utils/LinkUtils";

vi.mock("../../../../../pages/detail-page/context/detail-page-context", () => ({
  useDetailPageContext: vi.fn(),
}));

vi.mock("../../../../../utils/LinkUtils", () => ({
  openInNewTab: vi.fn(),
}));

describe("LinkCard", () => {
  const mockLink: ILink = {
    href: "https://example.com/test-link",
    rel: "test",
    title: "Test_Link_Title",
    type: "text/html",
    getIcon: vi.fn().mockReturnValue("/test-icon.svg"),
  };

  const mockCopyToClipboard = vi.fn();
  const mockCheckIfCopied = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(DetailPageContext.useDetailPageContext).mockReturnValue({
      checkIfCopied: mockCheckIfCopied,
      copyToClipboard: mockCopyToClipboard,
    } as any);
  });

  it("renders with correct link title", () => {
    render(<LinkCard link={mockLink} />);

    // Check if title is rendered and underscores are replaced with spaces
    const linkTitle = screen.getByText("Test Link Title");
    expect(linkTitle).toBeInTheDocument();
  });

  it("shows copy button on hover when link has not been copied", () => {
    vi.mocked(DetailPageContext.useDetailPageContext).mockReturnValue({
      checkIfCopied: mockCheckIfCopied.mockReturnValue(false),
      copyToClipboard: mockCopyToClipboard,
    } as any);

    render(<LinkCard link={mockLink} />);

    const linkCard = screen.getByTestId(`link-card-${mockLink.href}`);

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
    vi.mocked(DetailPageContext.useDetailPageContext).mockReturnValue({
      checkIfCopied: mockCheckIfCopied.mockReturnValue(true),
      copyToClipboard: mockCopyToClipboard,
    } as any);

    render(<LinkCard link={mockLink} />);

    // Wait for the button to be visible when clipboardText matches link.href
    return waitFor(() => {
      const copyButton = screen.queryByTestId(`copy-button-${mockLink.href}`);
      expect(copyButton).toBeInTheDocument();
    });
  });

  it("calls openInNewTab when link is clicked", () => {
    render(<LinkCard link={mockLink} />);

    const link = screen.getByText("Test Link Title");
    userEvent.click(link);
    return waitFor(
      () => {
        expect(LinkUtils.openInNewTab).toHaveBeenCalledWith(mockLink.href);
      },
      { timeout: 5000 }
    );
  });

  it("calls handleCopyToClipboard with correct URL when copy button is clicked", () => {
    render(<LinkCard link={mockLink} />);

    const linkCard = screen.getByTestId(`link-card-${mockLink.href}`);
    userEvent.hover(linkCard);
    return waitFor(() => {
      return screen.getByTestId(`copy-button-${mockLink.href}`);
    })
      .then((copyButton) => {
        userEvent.click(copyButton);
      })
      .then(() => {
        return waitFor(() => {
          expect(mockCopyToClipboard).toHaveBeenCalledWith(
            mockLink.href,
            mockLink.title
          );
        });
      });
  });
});
