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
      return waitFor(() => screen.findByText("About IMOS"), {
        timeout: 5000,
      }).then(() => {
        const aboutImosItem = screen.getByText("About IMOS");
        expect(aboutImosItem).toBeInTheDocument();

        // Click the "About IMOS" menu item
        user.click(aboutImosItem);
        // Check if openInNewTab was called with the correct URL
        return waitFor(() =>
          expect(openInNewTab).toHaveBeenCalledWith(pageDefault.url.IMOS)
        );
      });
    });
  });

  describe("ACCORDION_MENU style", () => {
    it("renders accordion menu correctly", () => {
      render(<HeaderMenu menuStyle={HeaderMenuStyle.ACCORDION_MENU} />);

      // Should have two accordion menus
      const accordions = screen.getAllByTestId("accordion-menu");
      expect(accordions).toHaveLength(3);

      // Should render menu summaries (About Us, Resources)
      // Here we trust MUI Accordion so no need to test the expand of accordion
      expect(screen.getByText("IMOS Home")).toBeInTheDocument();
      expect(screen.getByText("About Us")).toBeInTheDocument();
      expect(screen.getByText("Resources")).toBeInTheDocument();
    });
  });
});
