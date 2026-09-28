import { render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CollectionsQueryType } from "@/app/store/searchReducer";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { SearchResultLayoutEnum } from "@/components/common/buttons/ResultListLayoutButton";
import ResultCards from "../ResultCards";

const breakpoint = vi.hoisted(() => ({ isUnderLaptop: true }));

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
  default: () => <div />,
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
