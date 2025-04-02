import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { vi, beforeEach, describe, expect, afterAll, afterEach } from "vitest";
import store from "../../common/store/store";
import {
  removeAllItems,
  addItem,
  setTemporaryItem,
} from "../../common/store/bookmarkListReducer";
import { OGCCollection } from "../../common/store/OGCCollectionDefinitions";
import BookmarkListAccordionGroup from "../BookmarkListAccordionGroup";
import { userEvent } from "@testing-library/user-event";

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
  // Clear bookmark store value
  beforeEach(() => {
    store.dispatch(removeAllItems());
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

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

    // Click the clear all button
    waitFor(() => screen.findByText("bookmark-list-head-clearall")).then(() => {
      const button = screen.getByTestId("bookmark-list-head-clearall");
      userEvent.click(button);
      expect(screen.getByText("Bookmark List")).toBeInTheDocument();
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

    waitFor(() => screen.findByTestId("item3-iconbutton")).then(() => {
      // Now if you click the bookmark button of the temp record it will become bookmark record
      const button = screen.getByTestId("item3-iconbutton");
      userEvent.click(button);

      expect(store.getState().bookmarkList.temporaryItem).toBeUndefined();
      expect(screen.getByText("3 Bookmark(s)")).toBeInTheDocument();
    });
  });
});
