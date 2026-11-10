import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import PlainMenu, { type Menu } from "@/components/menu/PlainMenu";

describe("PlainMenu", () => {
  it("renders the menu button when visible is not set", () => {
    render(<PlainMenu menu={{ menu: { name: "Home" }, items: [] }} />);
    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
  });

  it("renders the menu button when visible returns true", () => {
    render(
      <PlainMenu
        menu={{ menu: { name: "Home", visible: () => true }, items: [] }}
      />
    );
    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
  });

  it("renders nothing when the menu's visible returns false", () => {
    const { container } = render(
      <PlainMenu
        menu={{
          menu: { name: "Hidden", visible: () => false },
          items: [{ name: "Child" }],
        }}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("omits sub-items whose visible returns false", async () => {
    const user = userEvent.setup();
    const shownHandler = vi.fn();
    const menu: Menu = {
      menu: { name: "Resources" },
      items: [
        { name: "Shown", handler: shownHandler },
        { name: "Also shown", visible: () => true },
        { name: "Hidden", visible: () => false },
      ],
    };
    render(<PlainMenu menu={menu} />);

    await user.click(screen.getByRole("button", { name: "Resources" }));

    expect(
      await screen.findByRole("menuitem", { name: "Shown" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Also shown" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();

    await user.click(screen.getByRole("menuitem", { name: "Shown" }));
    expect(shownHandler).toHaveBeenCalledTimes(1);
  });
});
