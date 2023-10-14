import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  columnVisibility: {
    createdDate: true,
    edit: true,
    name: true,
    parentName: true,
    description: true,
    id: false,
    __check__: true,
  },
};

const slice = createSlice({
  name: "team",
  initialState: initialState,
  reducers: {
    setColumnVisibility: (state, action) => {
      state.columnVisibility = action.payload;
    },
  },
});
const { reducer, actions } = slice;
export const { setColumnVisibility } = actions;
export default reducer;
