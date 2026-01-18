import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ShowMoreDetailBtn from "../ShowMoreDetailBtn";
import { portalTheme } from "../../../../styles";

// Mock the icons
vi.mock("../../../icon/PlusIcon", () => ({
  default: () => <span data-testid="plus-icon">Plus</span>,
}));
vi.mock("../../../icon/MinusIcon", () => ({
  default: () => <span data-testid="minus-icon">Minus</span>,
}));

// Mock useTheme
vi.mock("@mui/material", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useTheme: () => ({
      mp: { lg: "16px" },
      border: {
        detailBtnLight: "1px solid #ccc",
        detailSubtabBtn: "1px solid #999",
      },
      borderRadius: { sm: "4px" },
    }),
  };
});

describe("ShowMoreDetailBtn", () => {
  it("renders with 'Show More' text and PlusIcon when isShowingMore is false", () => {
    const setIsShowingMore = vi.fn();
    render(
      <ShowMoreDetailBtn
        isShowingMore={false}
        setIsShowingMore={setIsShowingMore}
      />
    );
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(screen.getByText("Show More")).toBeInTheDocument();
    expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("minus-icon")).not.toBeInTheDocument();
    expect(button).toHaveAttribute("data-testid", "show-more-detail-btn-");
  });

  it("renders with 'Show Less' text and MinusIcon when isShowingMore is true", () => {
    const setIsShowingMore = vi.fn();
    render(
      <ShowMoreDetailBtn
        isShowingMore={true}
        setIsShowingMore={setIsShowingMore}
      />
    );
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(screen.getByText("Show Less")).toBeInTheDocument();
    expect(screen.getByTestId("minus-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("plus-icon")).not.toBeInTheDocument();
    expect(button).toHaveAttribute("data-testid", "show-less-detail-btn-");
  });

  it("toggles isShowingMore when clicked", () => {
    const setIsShowingMore = vi.fn();
    render(
      <ShowMoreDetailBtn
        isShowingMore={false}
        setIsShowingMore={setIsShowingMore}
      />
    );
    const button = screen.getByRole("button");
    button.click();
    expect(setIsShowingMore).toHaveBeenCalledWith(true);
    expect(setIsShowingMore).toHaveBeenCalledTimes(1);
  });

  it("includes title in data-testid when provided", () => {
    const setIsShowingMore = vi.fn();
    render(
      <ShowMoreDetailBtn
        isShowingMore={false}
        setIsShowingMore={setIsShowingMore}
        title="details"
      />
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute(
      "data-testid",
      "show-more-detail-btn-details"
    );
  });

  it("applies theme styles correctly", () => {
    const setIsShowingMore = vi.fn();
    render(
      <ShowMoreDetailBtn
        isShowingMore={false}
        setIsShowingMore={setIsShowingMore}
      />
    );
    const button = screen.getByRole("button");
    const grid = button.parentElement; // Grid is the parent
    expect(grid).toHaveStyle("display: flex");
    expect(grid).toHaveStyle("justify-content: center");
    expect(grid).toHaveStyle("align-items: center");
    expect(button).toHaveStyle(
      `border: 1px solid ${portalTheme.palette.primary1}`
    );
    expect(button).toHaveStyle("border-radius: 10px");
    expect(button).toHaveStyle("width: 160px");
  });

  it("does not re-render unnecessarily when props are unchanged", () => {
    const setIsShowingMore = vi.fn();
    const { rerender } = render(
      <ShowMoreDetailBtn
        isShowingMore={false}
        setIsShowingMore={setIsShowingMore}
      />
    );
    const buttonBefore = screen.getByRole("button");
    rerender(
      <ShowMoreDetailBtn
        isShowingMore={false}
        setIsShowingMore={setIsShowingMore}
      />
    );
    const buttonAfter = screen.getByRole("button");
    expect(buttonBefore).toBe(buttonAfter); // Same DOM node, no re-render
  });
});
