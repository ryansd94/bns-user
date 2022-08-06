import { createSlice } from "@reduxjs/toolkit";
import { VisibleDefault } from 'configs/constants';

const initialState = {
    columnVisibility: {
        createdDate: true,
        edit: true,
        name: true,
        description: true,
        id: false,
        __check__: true,
    },
    toolbarVisible: { ...VisibleDefault },
    filters: []
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
        setFilter: (state, action) => {
            state.filters = action.payload;
        },
    },
});
const { reducer, actions } = slice;
export const { setColumnVisibility, setToolbarVisibility, setFilter } = actions;
export default reducer;
