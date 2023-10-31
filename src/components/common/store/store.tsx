import {configureStore} from '@reduxjs/toolkit';
import searchReducer from "./searchReducer";
import logger from 'redux-logger';

// https://stackoverflow.com/questions/69502147/changing-from-redux-to-redux-toolkit
// https://redux-toolkit.js.org/api/getDefaultMiddleware
const store = configureStore({
    // Add additional middleware to the default one.
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(logger),
    reducer: {
        searcher: searchReducer
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;