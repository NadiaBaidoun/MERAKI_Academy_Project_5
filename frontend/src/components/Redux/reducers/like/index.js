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
    removeLike: (state, action) => {
      state.likes = state.likes.filter((like) => {
        return like.id != action.payload;
      });
    },
  },
});

export const { setLikes, addLike, removeLike } = likeSlice.actions;

export default likeSlice.reducer;
