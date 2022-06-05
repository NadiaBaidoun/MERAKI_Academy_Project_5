import { createSlice } from "@reduxjs/toolkit";

const likeSlice = createSlice({
  name: "like",
  initialState: {
    likes: [],
    likesNumber: 0,
  },
  reducers: {
    setLikes: (state, action) => {
      state.likes = action.payload;
      state.likesNumber = state.likes.length;
    },
    addLike: (state, action) => {
      state.likesNumber = state.likesNumber + 1;
    },
    removeLike: (state, action) => {
      state.likesNumber = state.likesNumber - 1;
    },
  },
});

export const { setLikes, addLike, removeLike } = likeSlice.actions;

export default likeSlice.reducer;
