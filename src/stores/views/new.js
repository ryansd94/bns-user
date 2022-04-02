import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    config: {
        page: 0,
        sortModel: [],
        loading: false,
        data: [],
        isReload: false,
        loadingPopup: false,
        editData: "",
    }
};

const slice = createSlice({
    name: "new",
    initialState: initialState,
    reducers: {
        setConfig: (state, action) => {
            state.config = action.payload;
        },
        // setLoading: (state, action) => {
        //   state.loading = action.payload;
        // },
        // setPage: (state, action) => {
        //   state.page = action.payload;
        // },
        // setSort: (state, action) => {
        //   state.sortModel = action.payload;
        // },
        // setReload: (state, action) => {
        //   state.isReload = !state.isReload;
        // },
        // setLoadingPopup: (state, action) => {
        //   state.loadingPopup = action.payload;
        // },
        // setEditData: (state, action) => {
        //   state.editData = action.payload;
        // },
    },
});
const { reducer, actions } = slice;
export const { setConfig } = actions;
export default reducer;
