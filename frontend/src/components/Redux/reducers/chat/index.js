import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    senders: [],
    message: {},
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = [...state.messages, state.message];
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setSenders: (state, action) => {
      state.senders = [...state.senders, action.payload];
    },
    clearSenders: (state, action) => {
      state.senders = [];
    },
  },
});

export const { setMessages, setMessage, setSenders, clearSenders } =
  chatSlice.actions;

export default chatSlice.reducer;
