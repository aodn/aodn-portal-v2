import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi, beforeEach, describe, expect, afterAll } from "vitest";
import store from "../../common/store/store";
import { removeAllItems } from "../../common/store/bookmarkListReducer";
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
    waitFor(() => screen.findByTestId("bookmarkbutton-bookmarkicon")).then(
      () => {
        // Should not find this icon before click
        expect(
          store.getState().bookmarkList.items.find((i) => i.id === item.id)
        ).toBeFalsy();
        expect(
          screen.getByTestId("bookmarkbutton-bookmarkbordericon")
        ).not.toBeInTheDocument();

        // Click the button should trigger the bookmark state change
        const button = screen.getByTestId("bookmarkbutton-iconbutton");
        userEvent.click(button);
        // Icon changed
        expect(
          screen.getByTestId("bookmarkbutton-bookmarkbordericon")
        ).toBeInTheDocument();

        // The store should store the id of this item
        expect(
          store.getState().bookmarkList.items.find((i) => i.id === item.id)
        ).toBeTruthy();

        // Click button again reset the status
        userEvent.click(button);
        expect(
          store.getState().bookmarkList.items.find((i) => i.id === item.id)
        ).toBeFalsy();
        expect(
          screen.getByTestId("bookmarkbutton-bookmarkicon")
        ).toBeInTheDocument();
      }
    );
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
});
