import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || "",
    isLoggedIn: localStorage.getItem("token") ? true : false,
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("token", state.token);
    },
    logout: (state, action) => {
      state.token = "";
      state.isLoggedIn = false;
      localStorage.clear();
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
