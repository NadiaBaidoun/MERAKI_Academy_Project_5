import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    updateUserById: (state, action) => {
      state.users = state.users.map((user) => {
        if (user.id == action.payload.id) {
          return { ...user, bio: action.payload.bio ,country: action.payload.country, birthdate: action.payload.birthdate,cover: action.payload.cover,image: action.payload.image};
        }
        return user})},
        setUsers: (state, action) => {
          state.users = action.payload;
        },
        setUserName: (state, action) => {
          state.users = action.payload;
        },
  
 
}});

export const {setUsers,updateUserById,setUserName} =
userSlice.actions;

export default userSlice.reducer;
