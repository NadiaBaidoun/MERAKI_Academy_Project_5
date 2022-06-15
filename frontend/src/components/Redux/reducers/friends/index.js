import { createSlice } from "@reduxjs/toolkit";

const friendSlice = createSlice({
  name: "friend",
  initialState: {
    friends: [],
    onlineFriends: [],
  },
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    deleteFriendById: (state, action) => {
      state.friends = state.friends.filter((friend) => {
        return friend.id != action.payload;
      });
    },
    setOnlineFriends: (state, action) => {
      state.onlineFriends = action.payload;
    },
  },
});

export const { setFriends, deleteFriendById, setOnlineFriends } =
  friendSlice.actions;

export default friendSlice.reducer;
