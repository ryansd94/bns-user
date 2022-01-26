import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  onSubmit: null,
};

const popup = createSlice({
  name: "alertDialog",
  initialState: initialState,
  reducers: {
    open: (state, action) => {
      // const newPhoto = action.payload;
      state.open = action.payload;
    },
    onSubmit: (state, action) => {
      state.onSubmit = action.payload;
    },
  },
});
const { reducer, actions } = popup;
export const { open, onSubmit } = actions;
export default reducer;
