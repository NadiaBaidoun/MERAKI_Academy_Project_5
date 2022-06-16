import { configureStore } from "@reduxjs/toolkit";

//reducers
import postsReducer from "./posts";
import authReducer from "./auth";
import likeReducer from "./like";
import commentsReducer from "./comments";
import usersReducer from "./users";
import friendReducer from "./friends";
import chatReducer from "./chat";

export default configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
    like: likeReducer,
    comments: commentsReducer,
    users: usersReducer,
    friends: friendReducer,
    chat: chatReducer,
  },
});
