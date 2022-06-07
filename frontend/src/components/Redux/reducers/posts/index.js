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
          return {
            ...post,
            content: action.payload.content,
            image: action.payload.image,
          };
        }
        return post;
      });
    },
    deletePostById: (state, action) => {
      state.posts = state.posts.filter((post) => {
        return post.id != action.payload;
      });
    },
  },
});

export const { setPosts, addPost, updatePostById, deletePostById } =
  postSlice.actions;

export default postSlice.reducer;
