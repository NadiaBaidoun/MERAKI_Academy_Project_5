import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comment",
  initialState: {
    comments: [],
  },
  reducers: {
    setComments: (state, action) => {
      state.comments = action.payload;
    },
    addComment: (state, action) => {
      state.comments.push(action.payload);
    },

    updateCommentById: (state, action) => {
      state.comments = state.comments.map((comment) => {
        if (comment.id == action.payload.id) {
          return { ...comment, comment: action.payload.comment };
        }
        return comment;
      });
    },
  },
});

export const { setComments, addComment, updateCommentById } =
  commentSlice.actions;

export default commentSlice.reducer;
