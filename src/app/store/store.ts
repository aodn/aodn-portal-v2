import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { logger } from "redux-logger";
import searchReducer from "./searchReducer";
import searchParamsReducer from "./searchParamsReducer";
import bookmarkListReducer from "./bookmarkListReducer";

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disabled because class instances (OGCCollections) are kept in the
      // state — see TECH_DEBT before re-enabling.
      serializableCheck: false,
      thunk: true,
      // Console logging in development only; use Redux DevTools in any env.
    }).concat(import.meta.env.DEV ? [logger] : []),
  reducer: combineReducers({
    search: searchReducer,
    searchParams: searchParamsReducer,
    bookmarkList: bookmarkListReducer,
  }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

// Selectors live with their reducers; re-exported here for convenience.
export { getSearchQueryResult } from "./searchReducer";
export { getSearchParams } from "./searchParamsReducer";

export default store;
