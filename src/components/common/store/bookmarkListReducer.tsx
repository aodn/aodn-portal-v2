import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OGCCollection } from "./OGCCollectionDefinitions";
import { AppDispatch, RootState } from "./store";
import { fetchResultByUuidNoStore } from "./searchReducer";

interface BookmarkListState {
  isOpen: boolean;
  items: Array<OGCCollection>;
  temporaryItem: OGCCollection | undefined;
  expandedItem: OGCCollection | undefined;
}

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
      state.temporaryItem = action.payload;
    },
    setExpandedItem: (
      state,
      action: PayloadAction<OGCCollection | undefined>
    ) => {
      state.expandedItem = action.payload;
    },
    addItem: (state, action: PayloadAction<OGCCollection>) => {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.unshift(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

// Export actions
export const {
  setOpen,
  setItems,
  setTemporaryItem,
  setExpandedItem,
  addItem,
  removeItem,
} = bookmarkListSlice.actions;

// Thunk actions for async operations
export const fetchAndInsertTemporary =
  (id: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      // Assuming fetchResultByUuidNoStore is imported
      const res = await dispatch(fetchResultByUuidNoStore(id)).unwrap();
      dispatch(setTemporaryItem(res));
    } catch (error) {
      console.error("Error in fetchAndInsertTemporary:", error);
    }
  };

export const initializeBookmarkList = () => async (dispatch: AppDispatch) => {
  try {
    // Uncomment when storage utils are ready
    // const ids = loadBookmarkIdsFromStorage();
    // const items = await Promise.all(
    //   ids.map(id => dispatch(fetchResultByUuidNoStore(id)).unwrap())
    // );
    // dispatch(setItems(items));
  } catch (error) {
    console.error("Error loading bookmark items:", error);
  }
};

// Selectors
export const selectBookmarkList = (state: RootState) => state.bookmarkList;
export const selectBookmarkItems = (state: RootState) =>
  state.bookmarkList.items;
export const selectTemporaryItem = (state: RootState) =>
  state.bookmarkList.temporaryItem;
export const selectExpandedItem = (state: RootState) =>
  state.bookmarkList.expandedItem;
export const selectIsOpen = (state: RootState) => state.bookmarkList.isOpen;

export default bookmarkListSlice.reducer;
