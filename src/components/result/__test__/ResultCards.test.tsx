import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CollectionsQueryType } from "@/app/store/searchReducer";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { SearchResultLayoutEnum } from "@/components/common/buttons/ResultListLayoutButton";
import ResultCards from "../ResultCards";

const breakpoint = vi.hoisted(() => ({ isUnderLaptop: true }));
const cardProps = vi.hoisted(() => ({
  list: undefined as Record<string, unknown> | undefined,
  grid: undefined as Record<string, unknown> | undefined,
}));

vi.mock("@/hooks/useBreakpoint", () => ({
  default: () => breakpoint,
}));
vi.mock("@/hooks/useFetchData", () => ({
  default: () => ({ fetchRecord: vi.fn() }),
}));
vi.mock("@/hooks/useTabNavigation", () => ({
  default: () => vi.fn(),
}));
vi.mock("../ListResultCard", () => ({
  default: (props: Record<string, unknown>) => {
    cardProps.list = props;
    return <div />;
  },
}));
vi.mock("../GridResultCard", () => ({
  default: (props: Record<string, unknown>) => {
    cardProps.grid = props;
    return <div />;
  },
}));

afterEach(() => {
  vi.unstubAllGlobals();
});

it("observes the viewport on mobile and the list scroller on desktop", () => {
  const observer = { observe: vi.fn(), disconnect: vi.fn() };
  vi.stubGlobal(
    "IntersectionObserver",
    vi.fn(function () {
      return observer;
    })
  );
  const scrollRoot = document.createElement("div");
  const contents = {
    result: {
      collections: [{ hasCloudOptimisedData: () => false } as OGCCollection],
      total: 2,
    },
  } as CollectionsQueryType;
  const props = {
    layout: SearchResultLayoutEnum.FULL_LIST as const,
    contents,
    scrollRootRef: { current: scrollRoot },
    selectedUuids: undefined,
  };

  breakpoint.isUnderLaptop = true;
  const { rerender } = render(<ResultCards {...props} />);
  expect(IntersectionObserver).toHaveBeenLastCalledWith(expect.any(Function), {
    root: null,
    rootMargin: "200px 0px",
  });

  breakpoint.isUnderLaptop = false;
  rerender(<ResultCards {...props} />);
  expect(IntersectionObserver).toHaveBeenLastCalledWith(expect.any(Function), {
    root: scrollRoot,
    rootMargin: "200px 0px",
  });
  expect(observer.disconnect).toHaveBeenCalled();
});

it("forwards hover handlers separately from the click handler", () => {
  const onClickCard = vi.fn();
  const onMouseEnterCard = vi.fn();
  const onMouseLeaveCard = vi.fn();
  const contents = {
    result: {
      collections: [{ hasCloudOptimisedData: () => false } as OGCCollection],
      total: 1,
    },
  } as CollectionsQueryType;
  const props = {
    contents,
    selectedUuids: undefined,
    onClickCard,
    onMouseEnterCard,
    onMouseLeaveCard,
  };

  breakpoint.isUnderLaptop = false;
  const { rerender } = render(
    <ResultCards {...props} layout={SearchResultLayoutEnum.LIST} />
  );
  expect(cardProps.list?.onMouseEnterCard).toBe(onMouseEnterCard);
  expect(cardProps.list?.onMouseLeaveCard).toBeUndefined();
  expect(cardProps.list?.onClickCard).not.toBe(onMouseEnterCard);
  fireEvent.mouseLeave(screen.getByTestId("resultcard-result-list"));
  expect(onMouseLeaveCard).toHaveBeenCalledTimes(1);
  expect(onMouseLeaveCard).toHaveBeenCalledWith(undefined);

  onMouseLeaveCard.mockClear();
  rerender(
    <ResultCards {...props} layout={SearchResultLayoutEnum.FULL_LIST} />
  );
  expect(cardProps.list?.onMouseEnterCard).toBe(onMouseEnterCard);
  fireEvent.mouseLeave(screen.getByTestId("resultcard-result-list"));
  expect(onMouseLeaveCard).toHaveBeenCalledTimes(1);

  onMouseLeaveCard.mockClear();
  rerender(<ResultCards {...props} layout={SearchResultLayoutEnum.GRID} />);
  expect(cardProps.grid?.onMouseEnterCard).toBe(onMouseEnterCard);
  expect(cardProps.grid?.onMouseLeaveCard).toBeUndefined();
  expect(cardProps.grid?.onClickCard).not.toBe(onMouseEnterCard);
  fireEvent.mouseLeave(screen.getByTestId("resultcard-result-grid"));
  expect(onMouseLeaveCard).toHaveBeenCalledTimes(1);

  onMouseLeaveCard.mockClear();
  breakpoint.isUnderLaptop = true;
  rerender(<ResultCards {...props} layout={SearchResultLayoutEnum.LIST} />);
  fireEvent.mouseLeave(screen.getByTestId("resultcard-result-list"));
  expect(onMouseLeaveCard).not.toHaveBeenCalled();
});
