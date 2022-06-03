import { configureStore } from "@reduxjs/toolkit";

//reducers
import postsReducer from "./posts";
import authReducer from "./auth";

export default configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
  },
});
