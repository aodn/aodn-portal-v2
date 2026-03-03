import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { openInNewTab } from "../../../utils/LinkUtils";
import HeaderMenu, { HeaderMenuStyle } from "../components/HeaderMenu";
import { userEvent } from "@testing-library/user-event";
import { pageDefault } from "../../common/constants";

vi.mock("../../../utils/LinkUtils", () => ({
  openInNewTab: vi.fn(),
}));

describe("HeaderMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("DROPDOWN_MENU style", () => {
    it("renders dropdown menu when DROPDOWN_MENU style is provided", () => {
      render(<HeaderMenu menuStyle={HeaderMenuStyle.DROPDOWN_MENU} />);

      // Should have two dropdown menus (About Us, Resources)
      expect(screen.getByText("About Us")).toBeInTheDocument();
      expect(screen.getByText("Resources")).toBeInTheDocument();
    });

    it("calls openInNewTab when an About Us item is clicked", () => {
      const user = userEvent.setup();
      render(<HeaderMenu menuStyle={HeaderMenuStyle.DROPDOWN_MENU} />);

      // Find and click the "About Us" button to open dropdown
      const aboutUsButton = screen.getByText("About Us");
      user.click(aboutUsButton);

      // Wait for dropdown menu to appear and find "About IMOS" item
      return waitFor(() => screen.findByText("About AODN"), {
        timeout: 5000,
      }).then(() => {
        const aboutImosItem = screen.getByText("About AODN");
        expect(aboutImosItem).toBeInTheDocument();

        // Click the "About IMOS" menu item
        user.click(aboutImosItem);
        // Check if openInNewTab was called with the correct URL
        return waitFor(() =>
          expect(openInNewTab).toHaveBeenCalledWith(
            `${pageDefault.url.IMOS}/data/about-the-australian-ocean-data-network`
          )
        );
      });
    });
  });

  it("menu with no items is not expandable and calls handler on click", () => {
    const user = userEvent.setup();
    render(<HeaderMenu menuStyle={HeaderMenuStyle.ACCORDION_MENU} />);

    // "IMOS Home" has no sub-items — clicking it should navigate, not expand
    user.click(screen.getByText("IMOS Home"));

    return waitFor(() => {
      expect(openInNewTab).toHaveBeenCalledWith(pageDefault.url.IMOS);
      // Its accordion should have no expand icon
      const imosHomeAccordion = screen
        .getByText("IMOS Home")
        .closest("[data-testid='accordion-menu']");
      expect(
        imosHomeAccordion?.querySelector(
          ".MuiAccordionSummary-expandIconWrapper"
        )
      ).not.toBeInTheDocument();
    });
  });

  it("menu with items shows expand icon and does not call handler on click", () => {
    const user = userEvent.setup();
    render(<HeaderMenu menuStyle={HeaderMenuStyle.ACCORDION_MENU} />);

    // "About Us" has sub-items — clicking expands it, does not navigate
    user.click(screen.getByText("About Us"));

    return waitFor(() => {
      expect(openInNewTab).not.toHaveBeenCalled();
      // Its accordion should show an expand icon
      const aboutUsAccordion = screen
        .getByText("About Us")
        .closest("[data-testid='accordion-menu']");
      expect(
        aboutUsAccordion?.querySelector(
          ".MuiAccordionSummary-expandIconWrapper"
        )
      ).toBeInTheDocument();
    });
  });

  it("renders accordion menu correctly", () => {
    render(<HeaderMenu menuStyle={HeaderMenuStyle.ACCORDION_MENU} />);

    // Should have three accordion menus
    const accordions = screen.getAllByTestId("accordion-menu");
    expect(accordions).toHaveLength(3);

    // Should render menu summaries (About Us, Resources)
    // Here we trust MUI Accordion so no need to test the expand of accordion
    expect(screen.getByText("IMOS Home")).toBeInTheDocument();
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Resources")).toBeInTheDocument();
  });
});
