import { createSlice } from "@reduxjs/toolkit";
import { EAlertPopupType } from "configs";

const initialState = {
  open: false,
  title: null,
};

const popup = createSlice({
  name: "alertDialog",
  initialState: initialState,
  reducers: {
    open: (state, action) => {
      state.open = action.payload.open;
      state.title = action.payload.title;
    },
  },
});
const { reducer, actions } = popup;
export const { open } = actions;
export default reducer;
