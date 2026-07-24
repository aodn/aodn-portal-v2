import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import EventEmitter from "events";
import type { AppDispatch, RootState } from "./store";
import { fetchResultNoStore, jsonToOGCCollections } from "./searchReducer";
import { OGCCollection } from "@/app/api/ogcCollectionTypes";
import {
  BookmarkEvent,
  EVENT_BOOKMARK,
} from "@/components/map/mapbox/controls/menu/Definition";
import { ErrorResponse } from "@/utils/ErrorBoundary";
import {
  loadBookmarkIdsFromStorage,
  saveBookmarkIdsToStorage,
} from "@/utils/StorageUtils";
import { createFilterString } from "@/utils/StringUtils";

interface BookmarkListState {
  items: Array<OGCCollection>;
  temporaryItem: OGCCollection | undefined;
  expandedItem: OGCCollection | undefined;
}

// Bookmark button can use in multiple location for the same record, hence
// we need some kind of call back to notify components. To avoid warning
// we set a higher listener number
const emitter = new EventEmitter();
emitter.setMaxListeners(50);

const on = (type: EVENT_BOOKMARK, handle: (event: BookmarkEvent) => void) =>
  emitter.on(type, handle);

const off = (type: EVENT_BOOKMARK, handle: (event: BookmarkEvent) => void) =>
  emitter.off(type, handle);

// Fire events after the current call stack, so redux has finished the
// update and listeners can read the new state via getState().
// Payload stays untyped: the legacy events don't all match BookmarkEvent.
const emitLater = (type: EVENT_BOOKMARK, event: unknown) =>
  setTimeout(() => emitter.emit(type, event), 0.1);

const initialState: BookmarkListState = {
  items: [],
  temporaryItem: undefined,
  expandedItem: undefined,
};

// Reducers are pure: they only compute the next state. Side effects
// (event emits, localStorage writes) happen in the exported thunks below.
const bookmarkListSlice = createSlice({
  name: "bookmarkList",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Array<OGCCollection>>) => {
      state.items = action.payload;
    },
    temporaryItemSet: (
      state,
      action: PayloadAction<OGCCollection | undefined>
    ) => {
      state.temporaryItem = action.payload;
    },
    expandedItemSet: (
      state,
      action: PayloadAction<OGCCollection | undefined>
    ) => {
      state.expandedItem = action.payload;
    },
    itemAdded: (state, action: PayloadAction<OGCCollection>) => {
      state.items.unshift(action.payload);
    },
    itemRemoved: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    allItemsRemoved: (state) => {
      state.items = [];
      state.temporaryItem = undefined;
      state.expandedItem = undefined;
    },
  },
});

export const { setItems } = bookmarkListSlice.actions;
const {
  temporaryItemSet,
  expandedItemSet,
  itemAdded,
  itemRemoved,
  allItemsRemoved,
} = bookmarkListSlice.actions;

// Public API — same names and behavior as before, but as thunks so the
// reducers above stay pure.
export const setTemporaryItem =
  (item: OGCCollection | undefined) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (getState().bookmarkList.temporaryItem?.id !== item?.id) {
      dispatch(temporaryItemSet(item));
      emitLater(EVENT_BOOKMARK.TEMP, {
        id: item?.id,
        action: EVENT_BOOKMARK.TEMP,
        value: item,
      });
    }
  };

export const setExpandedItem =
  (item: OGCCollection | undefined) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    if (getState().bookmarkList.expandedItem?.id !== item?.id) {
      dispatch(expandedItemSet(item));
      emitLater(EVENT_BOOKMARK.EXPAND, {
        id: item,
        action: EVENT_BOOKMARK.EXPAND,
        value: item,
      });
    }
  };

export const addItem =
  (item: OGCCollection) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const exists = getState().bookmarkList.items.some((i) => i.id === item.id);
    if (!exists) {
      dispatch(itemAdded(item));
      saveBookmarkIdsToStorage(getState().bookmarkList.items);
      emitLater(EVENT_BOOKMARK.ADD, {
        id: item.id,
        action: EVENT_BOOKMARK.ADD,
        value: item,
      });
    }
  };

export const removeItem =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    const exists = getState().bookmarkList.items.some((i) => i.id === id);
    if (exists) {
      dispatch(itemRemoved(id));
      saveBookmarkIdsToStorage(getState().bookmarkList.items);
      emitLater(EVENT_BOOKMARK.REMOVE, {
        id,
        action: EVENT_BOOKMARK.REMOVE,
      });
    }
  };

export const removeAllItems = () => (dispatch: AppDispatch) => {
  dispatch(allItemsRemoved());
  saveBookmarkIdsToStorage([]);
  emitLater(EVENT_BOOKMARK.REMOVE_ALL, {
    id: "",
    action: EVENT_BOOKMARK.REMOVE_ALL,
  });
};

export { on, off };

// Thunk actions for initializing bookmarks from local storage
export const initializeBookmarkList = createAsyncThunk<
  void,
  void,
  { rejectValue: ErrorResponse; state: RootState; dispatch: AppDispatch }
>("bookmarkList/initialize", async (_, thunkAPI: any) => {
  const { dispatch } = thunkAPI;

  try {
    const storedIds = loadBookmarkIdsFromStorage();

    if (storedIds.length > 0) {
      const searchParams = {
        filter: createFilterString(storedIds),
      };

      await dispatch(fetchResultNoStore(searchParams))
        .unwrap()
        .then((value: string) => {
          const collections = jsonToOGCCollections(value).collections;
          dispatch(setItems(collections));
          // Emit INIT event after data is loaded
          emitLater(EVENT_BOOKMARK.INIT, {
            id: "",
            action: EVENT_BOOKMARK.INIT,
            value: collections,
          });
        });
    } else {
      // Even with no bookmarks, still emit INIT with empty array
      emitLater(EVENT_BOOKMARK.INIT, {
        id: "",
        action: EVENT_BOOKMARK.INIT,
        value: [],
      });
    }
  } catch (error) {
    // Bookmarks are non-critical: on failure fall back to an empty list
    // instead of rejecting, so the page keeps working.
    emitLater(EVENT_BOOKMARK.INIT, {
      id: "",
      action: EVENT_BOOKMARK.INIT,
      value: [],
    });
  }
});

// Selectors
export const getBookmarkList = (state: RootState) => state.bookmarkList;
export const selectBookmarkItems = (state: RootState) =>
  state.bookmarkList.items;
export const selectTemporaryItem = (state: RootState) =>
  state.bookmarkList.temporaryItem;
export const selectExpandedItem = (state: RootState) =>
  state.bookmarkList.expandedItem;
export const checkIsBookmarked = (state: RootState, uuid: string) => {
  return state.bookmarkList.items?.some(
    (item: OGCCollection) => item.id === uuid
  );
};

export default bookmarkListSlice.reducer;
