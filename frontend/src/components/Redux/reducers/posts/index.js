import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },
    updatePostById: (state, action) => {
      state.posts = state.posts.map((post) => {
        if (post.id == action.payload.id) {
          return { ...post, content: action.payload.content };
        }
        return post;
      });
    },
  },
});

export const { setPosts, addPost,updatePostById } = postSlice.actions;

export default postSlice.reducer;
