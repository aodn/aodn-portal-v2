import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { vi, beforeEach, describe, expect, afterAll, afterEach } from "vitest";
import store from "../../common/store/store";
import {
  removeAllItems,
  addItem,
  setTemporaryItem,
  setItems,
} from "../../common/store/bookmarkListReducer";
import { OGCCollection } from "../../common/store/OGCCollectionDefinitions";
import BookmarkListAccordionGroup from "../BookmarkListAccordionGroup";
import { userEvent } from "@testing-library/user-event";
import { server } from "../../../__mocks__/server";
import * as bookmarkListReducer from "../../common/store/bookmarkListReducer";
import { COLLECTIONS_WAVE } from "../../../__mocks__/data/COLLECTIONS_WAVE";

// Mock the OGCCollection item
const item1 = {
  id: "ba9110f1-072c-4d15-8328-2091be983991",
  index: "1",
  itemType: "Collection",
  links: [],
  properties: {},
};

const item2 = {
  id: "ca9110f1-072c-4d15-8328-2091be983998",
  index: "2",
  itemType: "Collection",
  links: [],
  properties: {},
};

const item3 = {
  id: "item3",
  index: "3",
  itemType: "Collection",
  links: [],
  properties: {},
};

const collection1: OGCCollection = Object.assign(new OGCCollection(), item1);
const collection2: OGCCollection = Object.assign(new OGCCollection(), item2);
const collection3: OGCCollection = Object.assign(new OGCCollection(), item3);

// Mock the local store, so that bookmarkListReducer save value to Record instead of the window store
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

describe("Bookmark List Accordion Group", () => {
  let mockInitialize: any;

  beforeAll(() => {
    server.listen();
    mockInitialize = vi.spyOn(bookmarkListReducer, "initializeBookmarkList");
  });

  beforeEach(() => {
    // Clear bookmark store value
    store.dispatch(removeAllItems());
    // Mock bookmark initialization to avoid the API call during initialization and get a bunch of unexpected bookmark items
    mockInitialize.mockImplementation(() => vi.fn);
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    vi.restoreAllMocks();
    server.close();
  });

  it("renders nothing bookmark list header correct", () => {
    render(<BookmarkListAccordionGroup />);
    expect(screen.getByText("Bookmark List")).toBeInTheDocument();
  });

  it("renders bookmark list with two items", () => {
    // Store value in store will result in the bookmark contains two items
    store.dispatch(addItem(collection1));
    store.dispatch(addItem(collection2));

    render(<BookmarkListAccordionGroup />);
    expect(screen.getByText("2 Bookmark(s)")).toBeInTheDocument();
  });

  it("renders bookmark list and clear all", () => {
    // Store value in store will result in the bookmark contains two items
    store.dispatch(addItem(collection1));
    store.dispatch(addItem(collection2));
    store.dispatch(setTemporaryItem(collection3));

    render(<BookmarkListAccordionGroup />);
    expect(screen.getByText("2 Bookmark(s)")).toBeInTheDocument();

    const clearAllButton = screen.getByTestId("bookmark-list-head-clearall");
    expect(clearAllButton).toBeInTheDocument();

    // Click the clear all button
    userEvent.click(clearAllButton);

    return waitFor(() =>
      expect(screen.getByText("Bookmark List")).toBeInTheDocument()
    ).then(() => {
      expect(store.getState().bookmarkList.temporaryItem).toBeUndefined();
    });
  });

  it("renders bookmark list with two items and add temp record, then bookmark", () => {
    // Store value in store will result in the bookmark contains two items
    store.dispatch(addItem(collection1));
    store.dispatch(addItem(collection2));

    render(<BookmarkListAccordionGroup />);
    expect(screen.getByText("2 Bookmark(s)")).toBeInTheDocument();

    // There is no temp bookmark
    expect(store.getState().bookmarkList.temporaryItem).toBeUndefined();

    // This cause a fetch to test server above and get the collection by the id
    store.dispatch(setTemporaryItem(collection3));

    expect(store.getState().bookmarkList.temporaryItem).not.toBeUndefined();

    // Temp item is not count in the bookmark list so the total is still 2
    expect(screen.getByText("2 Bookmark(s)")).toBeInTheDocument();

    return waitFor(() => screen.getByTestId("item3-iconbutton")).then(
      (button) => {
        // Now if you click the bookmark button of the temp record it will become bookmark record
        userEvent.click(button);

        return waitFor(() =>
          expect(store.getState().bookmarkList.temporaryItem).toBeUndefined()
        ).then(() => {
          expect(screen.getByText("3 Bookmark(s)")).toBeInTheDocument();
        });
      }
    );
  });

  it("initializes with correct items from initialization", async () => {
    // Mock initialization core function - setItems to update redux with 3 bookmark items
    store.dispatch(setItems([collection1, collection2, collection3]));

    render(<BookmarkListAccordionGroup />);

    await waitFor(() => {
      expect(screen.getByText("3 Bookmark(s)")).toBeInTheDocument();
    });
  });

  it("initializes with items from server response", async () => {
    mockInitialize.mockRestore();
    // Setup localStorage with bookmark IDs using the correct key
    const bookmarkIds = [collection1.id, collection2.id];

    // Mock localStorage to return these IDs with the correct key
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === "bookmark-list") {
        return JSON.stringify(bookmarkIds);
      }
      return null;
    });

    render(<BookmarkListAccordionGroup />);

    const mockHttpResponseLength = COLLECTIONS_WAVE.collections.length;

    // Wait for the async initialization to complete and server response
    // As the mock server return fixed mock data array, so the total bookmarks should be that array's length
    await waitFor(() =>
      expect(
        screen.getByText(`${mockHttpResponseLength} Bookmark(s)`)
      ).toBeInTheDocument()
    );
  });
});
