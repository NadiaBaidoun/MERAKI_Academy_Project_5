import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    allUsers: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    updateUserById: (state, action) => {
      state.users = state.users.map((user) => {
        if (user.id == action.payload.id) {
          return {
            ...user,
            bio: action.payload.bio,
            country: action.payload.country,
            birthdate: action.payload.birthdate,
            cover: action.payload.cover,
            image: action.payload.image,
          };
        }
        return user;
      });
    },
   
    setUserName: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setUsers, updateUserById, setUserName, setAllUsers } =
  userSlice.actions;

export default userSlice.reducer;
