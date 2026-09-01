import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import ResetSelections from "../ResetSelections";

describe("ResetSelections", () => {
  it("renders with aria-label 'Reset Selections'", () => {
    render(<ResetSelections />);
    expect(
      screen.getByRole("button", { name: "Reset Selections" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("TrashIcon")).toBeInTheDocument();
  });

  it("fires onReset once on click when enabled", async () => {
    const onReset = vi.fn();
    const user = userEvent.setup();
    render(<ResetSelections disabled={false} onReset={onReset} />);

    await user.click(screen.getByRole("button", { name: "Reset Selections" }));

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("does not call onReset when disabled", () => {
    const onReset = vi.fn();
    render(<ResetSelections disabled onReset={onReset} />);

    // MUI sets pointer-events: none on disabled buttons, which userEvent
    // refuses to click through — fireEvent bypasses that and still exercises
    // the real `disabled` attribute guard on the click handler.
    fireEvent.click(screen.getByRole("button", { name: "Reset Selections" }));

    expect(onReset).not.toHaveBeenCalled();
  });

  it("shows hint on hover when enabled", async () => {
    const user = userEvent.setup();
    render(<ResetSelections disabled={false} hint="Reset All Selections" />);

    const button = screen.getByRole("button", { name: "Reset Selections" });
    await user.hover(button.parentElement!);

    await waitFor(() => {
      expect(screen.getByText("Reset All Selections")).toBeInTheDocument();
    });
  });

  it("does not show hint on hover when disabled", async () => {
    const user = userEvent.setup();
    render(<ResetSelections disabled hint="Reset All Selections" />);

    const button = screen.getByRole("button", { name: "Reset Selections" });
    await user.hover(button.parentElement!);

    await waitFor(() => {
      expect(
        screen.queryByText("Reset All Selections")
      ).not.toBeInTheDocument();
    });
  });
});
