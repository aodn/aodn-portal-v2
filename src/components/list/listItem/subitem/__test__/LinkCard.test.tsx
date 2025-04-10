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

  it("shows copy button on hover when link has not been copied", async () => {
    vi.mocked(DetailPageContext.useDetailPageContext).mockReturnValue({
      checkIfCopied: mockCheckIfCopied.mockReturnValue(false),
      copyToClipboard: mockCopyToClipboard,
    } as any);

    render(<LinkCard link={mockLink} />);

    const linkCard = screen.getByTestId(`link-card-${mockLink.href}`);

    // Hover on the card
    await userEvent.hover(linkCard);
    await waitFor(() => {
      const copyButton = screen.queryByTestId(
        `copylinkbutton-${mockLink.href}`
      );
      expect(copyButton).toBeInTheDocument();
    });

    // Mouse leave
    await userEvent.unhover(linkCard);
    await waitFor(() => {
      const copyButton = screen.queryByTestId(
        `copylinkbutton-${mockLink.href}`
      );
      expect(copyButton).not.toBeInTheDocument();
    });
  });

  it("shows copy button when link has been copied", async () => {
    vi.mocked(DetailPageContext.useDetailPageContext).mockReturnValue({
      checkIfCopied: mockCheckIfCopied.mockReturnValue(true),
      copyToClipboard: mockCopyToClipboard,
    } as any);

    render(<LinkCard link={mockLink} />);

    // Wait for the button to be visible when clipboardText matches link.href
    await waitFor(() => {
      const copyButton = screen.queryByTestId(
        `copylinkbutton-${mockLink.href}`
      );
      expect(copyButton).toBeInTheDocument();
    });
  });

  it("calls openInNewTab when link is clicked", async () => {
    render(<LinkCard link={mockLink} />);

    const link = screen.getByText("Test Link Title");
    await userEvent.click(link);
    await waitFor(() => {
      expect(LinkUtils.openInNewTab).toHaveBeenCalledWith(mockLink.href);
    });
  });

  it("calls handleCopyToClipboard with correct URL when copy button is clicked", async () => {
    render(<LinkCard link={mockLink} />);

    const linkCard = screen.getByTestId(`link-card-${mockLink.href}`);
    await userEvent.hover(linkCard);
    const copyButton = await screen.findByTestId(
      `copylinkbutton-${mockLink.href}`
    );
    await userEvent.click(copyButton);
    await waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalledWith(
        mockLink.href,
        mockLink.title
      );
    });
  });
});
