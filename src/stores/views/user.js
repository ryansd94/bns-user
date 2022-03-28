import { createSlice } from "@reduxjs/toolkit";
import { VisibleDefault } from 'configs/constants';

const initialState = {
    columnVisibility: {
        createdDate: true,
        edit: true,
        email: true,
        fullName: true,
        id: false,
        status: true,
        __check__: true,
    },
    toolbarVisible: {...VisibleDefault}
};

const slice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setColumnVisibility: (state, action) => {
            state.columnVisibility = action.payload;
        },
        setToolbarVisibility: (state, action) => {
            state.toolbarVisible = action.payload;
        },
    },
});
const { reducer, actions } = slice;
export const { setColumnVisibility ,setToolbarVisibility} = actions;
export default reducer;
