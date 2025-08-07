import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NavigatablePanel, { NavigatablePanelChild } from "../NavigatablePanel";
import AppTheme from "../../../../../utils/AppTheme";
import { ThemeProvider } from "@mui/material/styles";
import { MemoryRouter } from "react-router-dom";

// Mock HTMLElement.prototype.scroll to simulate setting scrollTop and dispatching a 'scroll' event, vitests
// by default do not have this event
window.HTMLElement.prototype.scroll = function (
  options: number | ScrollToOptions | undefined = {}
) {
  if (typeof options === "number") {
    // Handle positional args like scroll(x, y) if needed, but your code uses object form
    this.scrollTop = options;
  } else {
    // Object form: { top, left, behavior }
    this.scrollTop = options.top || 0;
    this.scrollLeft = options.left || 0;
  }

  // Dispatch a 'scroll' event to trigger onScroll handlers
  const scrollEvent = new Event("scroll", { bubbles: true, cancelable: true });
  this.dispatchEvent(scrollEvent);
};

describe("NavigatablePanel", () => {
  const mockChildren: NavigatablePanelChild[] = [
    {
      title: "Section 1",
      component: (props: Record<string, any>) => (
        <div data-testid="section-1">
          {props.selected ? "Active" : "Inactive"}
        </div>
      ),
    },
    {
      title: "Section 2",
      component: (props: Record<string, any>) => (
        <div data-testid="section-2">
          {props.selected ? "Active" : "Inactive"}
        </div>
      ),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window.HTMLElement.prototype, "scroll");
  });

  it("renders loading state when isLoading is true", () => {
    render(
      <ThemeProvider theme={AppTheme}>
        <NavigatablePanel childrenList={mockChildren} isLoading={true} />
      </ThemeProvider>
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByText("Section 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Section 2")).not.toBeInTheDocument();
  });

  it("renders children list when isLoading is false", () => {
    render(
      <ThemeProvider theme={AppTheme}>
        <NavigatablePanel childrenList={mockChildren} isLoading={false} />
      </ThemeProvider>
    );
    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Section 2")).toBeInTheDocument();
    expect(screen.getByTestId("section-1")).toHaveTextContent("Active");
    expect(screen.getByTestId("section-2")).toHaveTextContent("Inactive");
  });
  // If user clicks the left panel, we expect the section item scroll to the target section
  // then the selected turn-on and left panel clicks position updated
  it("navigates to correct section when button is clicked", () => {
    render(
      <ThemeProvider theme={AppTheme}>
        <MemoryRouter>
          <NavigatablePanel childrenList={mockChildren} isLoading={false} />
        </MemoryRouter>
      </ThemeProvider>
    );

    // Mock offsetTop, offsetHeight, and clientHeight on specific elements
    const content1 = screen.getByTestId("section-box-1");
    const content2 = screen.getByTestId("section-box-2");
    const scrollable = screen.getByTestId("scrollable-section");

    // Directly set getters for layout properties as these props is not in vitest
    // we set the high of these component so that the scroll work as expected
    Object.defineProperty(content1, "offsetTop", { value: 0, writable: true });
    Object.defineProperty(content1, "offsetHeight", {
      value: 100,
      writable: true,
    });
    Object.defineProperty(content2, "offsetTop", {
      value: 100,
      writable: true,
    });
    Object.defineProperty(content2, "offsetHeight", {
      value: 100,
      writable: true,
    });
    Object.defineProperty(scrollable, "clientHeight", {
      value: 500,
      writable: true,
    });

    const section2Button = screen.getByText("Section 2");
    fireEvent.click(section2Button);

    return waitFor(() => {
      expect(screen.getByTestId("section-1")).toHaveTextContent("Inactive");
      expect(screen.getByTestId("section-2")).toHaveTextContent("Active");
    });
  });
});
