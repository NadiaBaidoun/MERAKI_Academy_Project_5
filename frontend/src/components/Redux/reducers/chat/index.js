import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "comment",
  initialState: {
    messages: [],
    message: {},
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { setMessages, setMessage } = chatSlice.actions;

export default chatSlice.reducer;
