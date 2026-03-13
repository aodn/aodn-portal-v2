import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi, beforeEach, describe, expect, afterAll, it } from "vitest";
import store from "../../common/store/store";
import {
  removeAllItems,
  addItem,
  setItems,
} from "../../common/store/bookmarkListReducer";
import { OGCCollection } from "../../common/store/OGCCollectionDefinitions";
import BookmarkButton from "../BookmarkButton";

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

describe("BookmarkButton", () => {
  // Clear bookmark store value
  beforeEach(() => {
    store.dispatch(removeAllItems());
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("Bookmark click and store update correct", () => {
    const item = {
      id: "ba9110f1-072c-4d15-8328-2091be983991",
      index: "1",
      itemType: "Collection",
      links: [],
      properties: {},
    };
    const collection: OGCCollection = Object.assign(new OGCCollection(), item);

    render(<BookmarkButton dataset={collection} />);
    return waitFor(() =>
      screen.findByTestId("ba9110f1-072c-4d15-8328-2091be983991-iconbutton")
    ).then(() => {
      // Should not find this icon before click
      expect(
        store.getState().bookmarkList.items.find((i) => i.id === item.id)
      ).toBeFalsy();
      expect(
        screen.queryByTestId(
          "ba9110f1-072c-4d15-8328-2091be983991-bookmarkicon"
        )
      ).toBeNull();

      // Click the button should trigger the bookmark state change
      const button = screen.getByTestId(
        "ba9110f1-072c-4d15-8328-2091be983991-iconbutton"
      );
      userEvent.click(button);
      // Icon changed
      expect(
        screen.getByTestId(
          "ba9110f1-072c-4d15-8328-2091be983991-bookmarkbordericon"
        )
      ).toBeInTheDocument();

      // The store should store the id of this item
      return waitFor(() =>
        expect(
          store.getState().bookmarkList.items.find((i) => i.id === item.id)
        ).toBeTruthy()
      ).then(() => {
        // Click button again reset the status
        userEvent.click(button);

        return waitFor(() =>
          expect(
            store.getState().bookmarkList.items.find((i) => i.id === item.id)
          ).toBeFalsy()
        ).then(() => {
          expect(
            screen.queryByTestId(
              "ba9110f1-072c-4d15-8328-2091be983991-bookmarkicon"
            )
          ).toBeNull();
        });
      });
    });
  });

  it("Verify remove_all event", async () => {
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

    const collection1: OGCCollection = Object.assign(
      new OGCCollection(),
      item1
    );
    const collection2: OGCCollection = Object.assign(
      new OGCCollection(),
      item2
    );

    render(
      <>
        <BookmarkButton dataset={collection1} dataTestId="item1" />
        <BookmarkButton dataset={collection2} dataTestId="item2" />
      </>
    );

    await waitFor(() => screen.getByTestId("item1-iconbutton"))
      // item1
      .then((item1BookmarkButton) => {
        const item2BookmarkButton = screen.getByTestId("item2-iconbutton");

        // Should render the bookmark border icon for both items
        expect(
          screen.getByTestId("item1-bookmarkbordericon")
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("item2-bookmarkbordericon")
        ).toBeInTheDocument();

        // Should not find both items in the store before click
        expect(
          store.getState().bookmarkList.items.find((i) => i.id === item1.id)
        ).toBeFalsy();
        expect(
          store.getState().bookmarkList.items.find((i) => i.id === item2.id)
        ).toBeFalsy();

        // Click the both bookmark buttons
        userEvent.click(item1BookmarkButton);
        userEvent.click(item2BookmarkButton);

        // Wait for icon change
        return waitFor(() => screen.getByTestId("item1-bookmarkicon")).then(
          () => {
            // The store should store the ids of both items
            expect(
              store.getState().bookmarkList.items.find((i) => i.id === item1.id)
            ).toBeTruthy();
            expect(
              store.getState().bookmarkList.items.find((i) => i.id === item2.id)
            ).toBeTruthy();

            store.dispatch(removeAllItems());

            // Wait for bookmark button icon change to the border icon
            return waitFor(() =>
              screen.getByTestId("item1-bookmarkbordericon")
            ).then(() => {
              expect(
                screen.getByTestId("item2-bookmarkbordericon")
              ).toBeInTheDocument();

              // After remove_all event, both items should be removed from the store
              expect(
                store
                  .getState()
                  .bookmarkList.items.find(
                    (i) => i.id === (item1.id || item2.id)
                  )
              ).toBeFalsy();
            });
          }
        );
      });
  });

  it("Renders with correct initial bookmark state when store is pre-populated ", async () => {
    const item1 = {
      id: "bookmark-init-test-1",
      index: "1",
      itemType: "Collection",
      links: [],
      properties: {},
    };

    const item2 = {
      id: "bookmark-init-test-2",
      index: "2",
      itemType: "Collection",
      links: [],
      properties: {},
    };

    const collection1: OGCCollection = Object.assign(
      new OGCCollection(),
      item1
    );
    const collection2: OGCCollection = Object.assign(
      new OGCCollection(),
      item2
    );

    // Pre-populate Redux store with bookmarks (simulating successful initialization)
    // This is what happens after initializeBookmarkList completes
    store.dispatch(setItems([collection1]));

    // Wait for store to be updated
    await waitFor(() => {
      expect(store.getState().bookmarkList.items).toHaveLength(1);
    });

    // Render BookmarkButtons - one bookmarked, one not
    render(
      <>
        <BookmarkButton dataset={collection1} dataTestId="init-test-1" />
        <BookmarkButton dataset={collection2} dataTestId="init-test-2" />
      </>
    );

    // The fix ensures buttons check store on mount via useState initializer
    // collection1 should show as bookmarked
    await waitFor(() => {
      expect(
        screen.getByTestId("init-test-1-bookmarkicon")
      ).toBeInTheDocument();
    });

    // collection2 should show as not bookmarked
    expect(
      screen.getByTestId("init-test-2-bookmarkbordericon")
    ).toBeInTheDocument();
  });

  it("Bookmark button responds to INIT event after Redux state is populated", async () => {
    const item = {
      id: "init-event-test-item",
      index: "1",
      itemType: "Collection",
      links: [],
      properties: {},
    };

    const collection: OGCCollection = Object.assign(new OGCCollection(), item);

    // Pre-populate store to simulate bookmarks loaded from localStorage
    store.dispatch(addItem(collection));

    // Render button after store is already populated
    render(<BookmarkButton dataset={collection} dataTestId="init-event" />);

    // Button should immediately show bookmarked state
    // because useState initializer checks the store
    await waitFor(() => {
      expect(screen.getByTestId("init-event-bookmarkicon")).toBeInTheDocument();
    });

    // Verify it's NOT showing the border icon
    expect(
      screen.queryByTestId("init-event-bookmarkbordericon")
    ).not.toBeInTheDocument();
  });
});
