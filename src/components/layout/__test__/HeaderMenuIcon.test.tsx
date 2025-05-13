import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HeaderIconMenu from "../components/HeaderIconMenu";

describe("HeaderIconMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the MenuIcon by default when closed", () => {
    render(<HeaderIconMenu />);

    // Initial state should have menu icon
    const menuIcon = screen.getByTestId("MenuIcon");
    expect(menuIcon).toBeDefined();
  });

  it("opens the menu when icon is clicked", () => {
    render(<HeaderIconMenu />);

    // Get the icon button and click it
    const iconButton = screen.getByRole("button");
    fireEvent.click(iconButton);

    // After clicking, the menu should be open
    const closeIcon = screen.getByTestId("CloseIcon");
    expect(closeIcon).toBeDefined();

    // Menu should be visible
    const menuContent = screen.getByText("About Us");
    expect(menuContent).toBeDefined();
  });
});
