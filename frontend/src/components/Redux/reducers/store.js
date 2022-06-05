import { configureStore } from "@reduxjs/toolkit";

//reducers
import postsReducer from "./posts";
import authReducer from "./auth";
import likeReducer from "./like";

export default configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
    like: likeReducer,
  },
});
