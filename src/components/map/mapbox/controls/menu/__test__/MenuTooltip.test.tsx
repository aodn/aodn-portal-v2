import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MenuTooltip from "../MenuTooltip";

describe("MenuTooltip auto-close", () => {
  let anchor: HTMLButtonElement;

  beforeEach(() => {
    vi.useFakeTimers();
    anchor = document.createElement("button");
    document.body.appendChild(anchor);
    vi.spyOn(anchor, "getBoundingClientRect").mockReturnValue({
      x: 100,
      y: 100,
      top: 100,
      left: 100,
      bottom: 120,
      right: 120,
      width: 20,
      height: 20,
      toJSON: () => ({}),
    });
  });

  afterEach(() => {
    cleanup();
    anchor.remove();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

  const setup = (autoCloseDelay?: number) => {
    const onClose = vi.fn();
    const props = {
      open: true,
      anchorEl: anchor,
      title: "Selection",
      description: "Help",
      icon: null,
      onClose,
      autoCloseDelay,
    };
    return { ...render(<MenuTooltip {...props} />), onClose, props };
  };

  it("closes after exactly two seconds without hover", () => {
    const { onClose } = setup();
    advance(1999);
    expect(onClose).not.toHaveBeenCalled();
    advance(1);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("uses the parent-supplied delay after leaving hover", () => {
    const { onClose } = setup(5000);
    advance(2000);
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseEnter(anchor);
    advance(6000);
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseLeave(anchor);
    advance(4999);
    expect(onClose).not.toHaveBeenCalled();
    advance(1);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("waits for the initially hovered button and popup to be left", () => {
    vi.spyOn(anchor, "matches").mockImplementation(
      (selector) => selector === ":hover"
    );
    const { onClose } = setup();
    advance(3000);
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseLeave(anchor);
    advance(1000);
    const popup = screen.getByTestId("menu-tooltip");
    fireEvent.mouseEnter(popup);
    advance(3000);
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseLeave(popup);
    advance(1999);
    expect(onClose).not.toHaveBeenCalled();
    advance(1);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("restarts the full delay after returning to the button", () => {
    const { onClose } = setup();
    advance(1500);
    fireEvent.mouseEnter(anchor);
    advance(3000);
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseLeave(anchor);
    advance(1999);
    expect(onClose).not.toHaveBeenCalled();
    advance(1);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("cancels pending timers when closed or unmounted", () => {
    const { onClose, props, rerender, unmount } = setup();
    advance(1000);
    rerender(<MenuTooltip {...props} open={false} />);
    advance(3000);
    expect(onClose).not.toHaveBeenCalled();
    rerender(<MenuTooltip {...props} />);
    advance(1000);
    unmount();
    advance(3000);
    expect(onClose).not.toHaveBeenCalled();
  });
});
