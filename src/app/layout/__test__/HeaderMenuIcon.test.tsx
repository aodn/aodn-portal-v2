import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HeaderIconMenu from "../HeaderIconMenu";
import { MemoryRouter } from "react-router-dom";

describe("HeaderIconMenu", () => {
  const renderMenu = () =>
    render(
      <MemoryRouter>
        <HeaderIconMenu />
      </MemoryRouter>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the MenuIcon by default when closed", () => {
    renderMenu();

    // Initial state should have menu icon
    const menuIcon = screen.getByTestId("MenuIcon");
    expect(menuIcon).toBeDefined();
  });

  it("opens the menu when icon is clicked", () => {
    renderMenu();

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
