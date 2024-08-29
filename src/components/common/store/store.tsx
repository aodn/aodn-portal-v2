import { combineReducers, configureStore } from "@reduxjs/toolkit";
import searchReducer from "./searchReducer";
import { logger } from "redux-logger";
import paramReducer from "./componentParamReducer";

// https://stackoverflow.com/questions/69502147/changing-from-redux-to-redux-toolkit
// https://redux-toolkit.js.org/api/getDefaultMiddleware
const store = configureStore({
  // Add additional middleware to the default one.
  middleware: (getDefaultMiddleware) =>
    // https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
  reducer: combineReducers({
    // Add your reducers here
    searcher: searchReducer,
    paramReducer: paramReducer,
  }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

const searchQueryResult = (state: RootState) =>
  state.searcher.collectionsQueryResult;

const getComponentState = (state: RootState) => state.paramReducer;

export { searchQueryResult, getComponentState };

export default store;
