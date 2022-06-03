import { createSlice } from "@reduxjs/toolkit";

const likeSlice = createSlice({
  name: "like",
  initialState: {
    likes: [],
  },
  reducers: {
    setLikes: (state, action) => {
      state.likes = action.payload;
    },
    addLike: (state, action) => {
      state.likes.push(action.payload);
    },
  },
});

export const { setLikes, addLike } = likeSlice.actions;

export default likeSlice.reducer;
