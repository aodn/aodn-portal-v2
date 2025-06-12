import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { openInNewTab } from "../../../utils/LinkUtils";
import HeaderMenu, { HeaderMenuStyle } from "../components/HeaderMenu";
import { userEvent } from "@testing-library/user-event";

vi.mock("../../../utils/LinkUtils", () => ({
  openInNewTab: vi.fn(),
}));

describe("HeaderMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("HOVER_MENU style", () => {
    it("renders hover menu when HOVER_MENU style is provided", () => {
      render(<HeaderMenu menuStyle={HeaderMenuStyle.HOVER_MENU} />);

      // Should have two hover menus (About Us, Resources)
      expect(screen.getByText("About Us")).toBeInTheDocument();
      expect(screen.getByText("Resources")).toBeInTheDocument();
    });

    it("calls openInNewTab when an About Us item is clicked", () => {
      render(<HeaderMenu menuStyle={HeaderMenuStyle.HOVER_MENU} />);

      // Find menu button "About Us"
      const aboutUsButton = screen.getByText("About Us");
      userEvent.hover(aboutUsButton);

      // Wait for hover event to show menu
      return waitFor(() => screen.findByText("About IMOS"), {
        timeout: 1000,
      }).then((aboutImosItem) => {
        expect(aboutImosItem).toBeInTheDocument();

        // Click menu item "About Imos"
        fireEvent.click(aboutImosItem);

        // Check if openInNewTab was called with the correct URL
        expect(openInNewTab).toHaveBeenCalledWith("https://imos.org.au/");
      });
    });
  });

  describe("ACCORDION_MENU style", () => {
    it("renders accordion menu correctly", () => {
      render(<HeaderMenu menuStyle={HeaderMenuStyle.ACCORDION_MENU} />);

      // Should have two accordion menus
      const accordions = screen.getAllByTestId("accordion-menu");
      expect(accordions).toHaveLength(2);

      // Should render menu summaries (About Us, Resources)
      // Here we trust MUI Accordion so no need to test the expand of accordion
      expect(screen.getByText("About Us")).toBeInTheDocument();
      expect(screen.getByText("Resources")).toBeInTheDocument();
    });
  });
});
