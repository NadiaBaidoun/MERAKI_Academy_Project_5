import { configureStore } from "@reduxjs/toolkit";

//reducers

import postReducer from './Post'
import postsReducer from "./posts";

export default configureStore({
  reducer: {
//     Nadia
    posts:postReducer, 
//     Faris
      post: postsReducer
});
