import { render, screen, waitFor } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/__mocks__/server";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "@/app/store/store";
import { CollectionsQueryType } from "@/app/store/searchReducer";
import { ILink, OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import AdminScreenContext from "@/components/admin/AdminScreenContext";
import { SearchResultLayoutEnum } from "@/components/common/buttons/ResultListLayoutButton";
import ResultCards from "../ResultCards";
import { ResultCardBasicType } from "../types";

const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

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
// A Download button, disabled the same way as the real cards do
const MockCard = ({ content, onClickDownload }: ResultCardBasicType) => (
  <button disabled={onClickDownload === undefined}>{content?.title}</button>
);
vi.mock("../ListResultCard", () => ({
  default: (props: ResultCardBasicType) => <MockCard {...props} />,
}));
vi.mock("../GridResultCard", () => ({
  default: (props: ResultCardBasicType) => <MockCard {...props} />,
}));

// Each collection has its own id, so the requests are easy to tell apart
let idCount = 0;
const createCollection = (title: string, links: Partial<ILink>[]) =>
  Object.assign(new OGCCollection(), {
    id: `result-cards-${idCount++}`,
    title,
    links: links as ILink[],
  });
const createContents = (collections: OGCCollection[]) =>
  ({
    result: { collections, total: collections.length },
  }) as CollectionsQueryType;

const wfsLink = { rel: "wfs", title: "layer" };
const requested: string[] = [];

beforeAll(() => server.listen());
afterEach(() => {
  vi.unstubAllGlobals();
  server.resetHandlers();
  requested.length = 0;
});
afterAll(() => server.close());

const mockWfsLayers = (availableIds: string[]) =>
  server.use(
    http.get(
      "/api/v1/ogc/collections/:uuid/items/wfs_layers",
      ({ params, request }) => {
        const id = params.uuid as string;
        const allowList = new URL(request.url).searchParams.get(
          "enableGeoServerWhiteList"
        );
        requested.push(`${id} ${allowList}`);
        return availableIds.includes(id)
          ? HttpResponse.json([{ name: "imos:layer", title: "Layer" }])
          : new HttpResponse(null, { status: 404 });
      }
    )
  );

const settle = () => new Promise((resolve) => setTimeout(resolve, 50));
const getDownload = (name: string) => screen.getByRole("button", { name });

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
      collections: [new OGCCollection()],
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
  const { rerender } = render(<ResultCards {...props} />, { wrapper });
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

it.each([
  SearchResultLayoutEnum.LIST as const,
  SearchResultLayoutEnum.GRID as const,
  SearchResultLayoutEnum.FULL_LIST as const,
])("enables Download for each download type in %s layout", async (layout) => {
  const wfs = createCollection("WFS", [wfsLink]);
  const wfsNoLayer = createCollection("WFS without layer", [wfsLink]);
  const contents = createContents([
    createCollection("CO", [{ rel: "summary", title: "a.parquet" }, wfsLink]),
    createCollection("NetCDFs", [
      { rel: "file-list", title: "original_netcdfs" },
      wfsLink,
    ]),
    wfs,
    wfsNoLayer,
    createCollection("None", [{ rel: "wms", title: "layer" }]),
  ]);
  mockWfsLayers([wfs.id]);

  breakpoint.isUnderLaptop = false;
  render(
    <ResultCards
      layout={layout}
      contents={contents}
      selectedUuids={undefined}
    />,
    { wrapper }
  );
  expect(getDownload("CO")).toBeEnabled();
  expect(getDownload("NetCDFs")).toBeEnabled();
  // Disabled while checking
  expect(getDownload("WFS")).toBeDisabled();

  await waitFor(() => expect(getDownload("WFS")).toBeEnabled());
  await settle();
  expect(getDownload("WFS without layer")).toBeDisabled();
  expect(getDownload("None")).toBeDisabled();
  expect(requested).toEqual([`${wfs.id} true`, `${wfsNoLayer.id} true`]);
});

it("checks nothing for simplified cards", async () => {
  const wfs = createCollection("WFS", [wfsLink]);
  mockWfsLayers([wfs.id]);

  breakpoint.isUnderLaptop = true;
  render(
    <ResultCards
      layout={SearchResultLayoutEnum.LIST}
      contents={createContents([wfs])}
      selectedUuids={undefined}
    />,
    { wrapper }
  );
  await settle();

  expect(requested).toEqual([]);
});

it("uses the allow list setting of the admin screen", async () => {
  const wfs = createCollection("WFS", [wfsLink]);
  mockWfsLayers([wfs.id]);

  breakpoint.isUnderLaptop = false;
  render(
    <AdminScreenContext.Provider value={{ enableGeoServerWhiteList: false }}>
      <ResultCards
        layout={SearchResultLayoutEnum.LIST}
        contents={createContents([wfs])}
        selectedUuids={undefined}
      />
    </AdminScreenContext.Provider>,
    { wrapper }
  );

  await waitFor(() => expect(getDownload("WFS")).toBeEnabled());
  expect(requested).toEqual([`${wfs.id} false`]);
});
