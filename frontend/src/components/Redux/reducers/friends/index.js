import { createSlice } from "@reduxjs/toolkit";

const friendSlice = createSlice({
  name: "friend",
  initialState: {
    friends: [],
  },
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
  
  },
});

export const { setFriends, } =
friendSlice.actions;

export default friendSlice.reducer;
