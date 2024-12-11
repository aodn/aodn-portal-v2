import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OGCCollection } from "./OGCCollectionDefinitions";
import { AppDispatch, RootState } from "./store";
import { fetchResultByUuidNoStore } from "./searchReducer";
import EventEmitter from "events";
import {
  BookmarkEvent,
  EVENT_BOOKMARK,
} from "../../map/mapbox/controls/menu/Definition";
import { errorHandling, ErrorResponse } from "../../../utils/ErrorBoundary";

interface BookmarkListState {
  isOpen: boolean;
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

// TODO: need to implement initial bookmark items list in the future by getting uuids array from browser storage and fetching collections
const initialState: BookmarkListState = {
  isOpen: true,
  items: [],
  temporaryItem: undefined,
  expandedItem: undefined,
};

const bookmarkListSlice = createSlice({
  name: "bookmarkList",
  initialState,
  reducers: {
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setItems: (state, action: PayloadAction<Array<OGCCollection>>) => {
      state.items = action.payload;
      // saveBookmarkIdsToStorage(action.payload);
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
  setTemporaryItem,
  setExpandedItem,
  addItem,
  removeItem,
  removeAllItems,
} = bookmarkListSlice.actions;

export { on, off };

// Thunk actions for async operations, avoid getState() where someone is calling the reducer
export const fetchAndInsertTemporary = createAsyncThunk<
  void,
  string,
  { rejectValue: ErrorResponse; state: RootState; dispatch: AppDispatch }
>("bookmarkList/fetchAndInsertTemporary", async (id: string, thunkAPI: any) => {
  const { dispatch, getState } = thunkAPI;
  const state = getState();
  // Check if item exists in items array
  const existingItem = state.bookmarkList.items.find(
    (item: { id: string }) => item.id === id
  );

  // Check if item is already a temporary item
  const isTemporaryItem = state.bookmarkList.temporaryItem?.id === id;

  if (existingItem || isTemporaryItem) {
    // If item exists in either place, just expand it
    dispatch(setExpandedItem(existingItem || state.bookmarkList.temporaryItem));
  } else {
    // If item doesn't exist anywhere, fetch it, set as temporary and expand
    await dispatch(fetchResultByUuidNoStore(id))
      .unwrap()
      .then((res: OGCCollection) => {
        dispatch(setTemporaryItem(res));
        dispatch(setExpandedItem(res));
      })
      .catch((err: Error) => {
        errorHandling(thunkAPI);
      });
  }
});

// export const initializeBookmarkList = () => async (dispatch: AppDispatch) => {
//   try {
//     const ids = loadBookmarkIdsFromStorage();
//     const items = await Promise.all(
//       ids.map((id) => dispatch(fetchResultByUuidNoStore(id)).unwrap())
//     );
//     dispatch(setItems(items));
//   } catch (error) {
//     console.error("Error loading bookmark items:", error);
//   }
// };

// Selectors
export const getBookmarkList = (state: RootState) => state.bookmarkList;
export const selectBookmarkItems = (state: RootState) =>
  state.bookmarkList.items;
export const selectTemporaryItem = (state: RootState) =>
  state.bookmarkList.temporaryItem;
export const selectExpandedItem = (state: RootState) =>
  state.bookmarkList.expandedItem;
export const selectIsOpen = (state: RootState) => state.bookmarkList.isOpen;
export const checkIsBookmarked = (state: RootState, uuid: string) => {
  return state.bookmarkList.items?.some(
    (item: OGCCollection) => item.id === uuid
  );
};

export default bookmarkListSlice.reducer;
