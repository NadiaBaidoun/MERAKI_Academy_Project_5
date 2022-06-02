import { configureStore } from "@reduxjs/toolkit";

//reducers
import postReducer from "./post";

export default configureStore({
  reducer: {
    post: postReducer,
  },
});
