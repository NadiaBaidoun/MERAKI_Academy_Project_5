import { configureStore } from "@reduxjs/toolkit";

//reducers
import postReducer from './Post'
export default configureStore({
  reducer: {
    posts:postReducer,
  },
});
