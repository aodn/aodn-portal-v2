import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchbarState {
  isExpanded: boolean;
}

const initialState: SearchbarState = {
  isExpanded: false,
};

const searchbarSlice = createSlice({
  name: "searchbar",
  initialState,
  reducers: {
    updateSearchbarExpansion(state, action: PayloadAction<boolean>) {
      state.isExpanded = action.payload;
    },
  },
});

export const { updateSearchbarExpansion } = searchbarSlice.actions;

export default searchbarSlice.reducer;
