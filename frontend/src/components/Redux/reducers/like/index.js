import { createSlice } from "@reduxjs/toolkit";

const likeSlice = createSlice({
  name: "like",
  initialState: {
    likes: [],
    like: "",
    notification: [],
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
    setLike: (state, action) => {
      state.like = action.payload;
    },
    setNotification: (state, action) => {
      state.notification = [...state.notification, action.payload];
    },
    clearNotification: (state, action) => {
      state.notification = [];
    },
  },
});

export const {
  setLikes,
  addLike,
  removeLike,
  setLike,
  setNotification,
  clearNotification,
} = likeSlice.actions;

export default likeSlice.reducer;
