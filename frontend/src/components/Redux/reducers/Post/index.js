import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  name: "post",
  initialState: {
    post: [],
  },
  reducers: {
    addPost: (state, action) => {
      state.post.push(action.payload);
    },
  },
});

export const { addPost } = postsSlice.actions;

export default postsSlice.reducer;
