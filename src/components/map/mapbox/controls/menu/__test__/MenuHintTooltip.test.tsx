import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import MenuHintTooltip from "../MenuHintTooltip";

const renderTooltip = (disable: boolean) =>
  render(
    <MenuHintTooltip hint="Test hint" disable={disable}>
      <button>Click me</button>
    </MenuHintTooltip>
  );

describe("MenuHintTooltip", () => {
  it("renders children", () => {
    renderTooltip(false);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("shows hint on hover when not disabled", () => {
    renderTooltip(false);
    expect(screen.queryByText("Test hint")).not.toBeInTheDocument();

    userEvent.hover(screen.getByRole("button").parentElement!);
    return waitFor(() => screen.findByText("Test hint")).then(() => {
      expect(screen.getByText("Test hint")).toBeInTheDocument();
    });
  });

  it("hides hint after mouse leaves", () => {
    const user = userEvent.setup();
    renderTooltip(false);
    const wrapper = screen.getByRole("button").parentElement!;

    user.hover(wrapper);
    return waitFor(() => screen.findByText("Test hint")).then(() => {
      user.unhover(wrapper);
      return waitFor(() => {
        expect(screen.queryByText("Test hint")).not.toBeInTheDocument();
      });
    });
  });

  it("does not show hint on hover when disabled", () => {
    renderTooltip(true);

    userEvent.hover(screen.getByRole("button").parentElement!);
    return waitFor(() => {
      expect(screen.queryByText("Test hint")).not.toBeInTheDocument();
    });
  });
});
