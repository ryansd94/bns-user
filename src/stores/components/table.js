import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isReload: false,
};

const slice = createSlice({
  name: "table",
  initialState: initialState,
  reducers: {
    reload: (state, action) => {
      state.isReload = !state.isReload;
    },
  },
});
const { reducer, actions } = slice;
export const { reload } = actions;
export default reducer;
