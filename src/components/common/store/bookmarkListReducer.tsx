import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import EventEmitter from "events";
import { AppDispatch, RootState } from "./store";
import { fetchResultNoStore } from "./searchReducer";
import { OGCCollection, OGCCollections } from "./OGCCollectionDefinitions";
import {
  BookmarkEvent,
  EVENT_BOOKMARK,
} from "../../map/mapbox/controls/menu/Definition";
import { errorHandling, ErrorResponse } from "../../../utils/ErrorBoundary";
import {
  loadBookmarkIdsFromStorage,
  saveBookmarkIdsToStorage,
} from "../../../utils/StorageUtils";
import { createFilterString } from "../../../utils/StringUtils";

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

const initialState: BookmarkListState = {
  items: [],
  temporaryItem: undefined,
  expandedItem: undefined,
};

const bookmarkListSlice = createSlice({
  name: "bookmarkList",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Array<OGCCollection>>) => {
      state.items = action.payload;
    },
    setTemporaryItem: (
      state,
      action: PayloadAction<OGCCollection | undefined>
    ) => {
      if (state.temporaryItem?.id !== action.payload?.id) {
        state.temporaryItem = action.payload;
        // Fire event later, so we completed the redux update
        // and other can use getState() to read it without issue
        setTimeout(() => {
          emitter.emit(EVENT_BOOKMARK.TEMP, {
            id: action.payload?.id,
            action: EVENT_BOOKMARK.TEMP,
            value: action.payload,
          });
        }, 0.1);
      }
    },
    setExpandedItem: (
      state,
      action: PayloadAction<OGCCollection | undefined>
    ) => {
      if (state.expandedItem?.id !== action.payload?.id) {
        state.expandedItem = action.payload;
        // Fire event later, so we completed the redux update
        // and other can use getState() to read it without issue
        setTimeout(() => {
          emitter.emit(EVENT_BOOKMARK.EXPAND, {
            id: action.payload,
            action: EVENT_BOOKMARK.EXPAND,
            value: action.payload,
          });
        }, 0.1);
      }
    },
    addItem: (state, action: PayloadAction<OGCCollection>) => {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.unshift(action.payload);
        saveBookmarkIdsToStorage(state.items);
        // Fire event later, so we completed the redux update
        // and other can use getState() to read it without issue
        setTimeout(() => {
          emitter.emit(EVENT_BOOKMARK.ADD, {
            id: action.payload.id,
            action: EVENT_BOOKMARK.ADD,
            value: action.payload,
          });
        }, 0.1);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const exists = state.items.some((item) => item.id === action.payload);
      if (exists) {
        state.items = state.items.filter((item) => item.id !== action.payload);
        saveBookmarkIdsToStorage(state.items);
        // Fire event later, so we completed the redux update
        // and other can use getState() to read it without issue
        setTimeout(() => {
          emitter.emit(EVENT_BOOKMARK.REMOVE, {
            id: action.payload,
            action: EVENT_BOOKMARK.REMOVE,
          });
        }, 0.1);
      }
    },
    removeAllItems: (state) => {
      state.items = [];
      state.temporaryItem = undefined;
      state.expandedItem = undefined;
      saveBookmarkIdsToStorage([]);
      // Fire event later, so we completed the redux update
      // and other can use getState() to read it without issue
      setTimeout(() => {
        emitter.emit(EVENT_BOOKMARK.REMOVE_ALL, {
          id: "",
          action: EVENT_BOOKMARK.REMOVE_ALL,
        });
      }, 0.1);
    },
  },
});

// Export actions
export const {
  setItems,
  setTemporaryItem,
  setExpandedItem,
  addItem,
  removeItem,
  removeAllItems,
} = bookmarkListSlice.actions;

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
        .then((value: OGCCollections) => {
          dispatch(setItems(value.collections));
          // Emit INIT event after data is loaded
          setTimeout(() => {
            emitter.emit(EVENT_BOOKMARK.INIT, {
              id: "",
              action: EVENT_BOOKMARK.INIT,
              value: value.collections,
            });
          }, 0.1);
        });
    } else {
      // Even with no bookmarks, still emit INIT with empty array
      setTimeout(() => {
        emitter.emit(EVENT_BOOKMARK.INIT, {
          id: "",
          action: EVENT_BOOKMARK.INIT,
          value: [],
        });
      }, 0.1);
    }
  } catch (error) {
    errorHandling(thunkAPI);
    // Emit INIT with empty array in case of error
    setTimeout(() => {
      emitter.emit(EVENT_BOOKMARK.INIT, {
        id: "",
        action: EVENT_BOOKMARK.INIT,
        value: [],
      });
    }, 0.1);
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
