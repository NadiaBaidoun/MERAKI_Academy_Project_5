import { configureStore } from "@reduxjs/toolkit";

//reducers
import postReducer from "./posts";

export default configureStore({
  reducer: {
    post: postReducer
  },
});
