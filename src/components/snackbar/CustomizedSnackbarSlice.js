import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    title: '',
    severity: '',
    status
}


const slice = createSlice({
    name: 'snackbar',
    initialState: initialState,
    reducers: {
        openSuccess: (state, action) => {
            // const newPhoto = action.payload;
            state.open = true;
            state.severity = "success";
        },
        openError: (state, action) => {
            // const newPhoto = action.payload;
            state.open = true;
            state.severity = "error";
        },
        openMessage: (state, action) => {
            // const newPhoto = action.payload;
            if (action.payload.status === '200') {
                state.open = true;
                state.severity = "success";
            }
            else {

                state.open = true;
                state.severity = "error";
            }
        },
        close: (state, action) => {
            state.open = false;
        },
        change_title: (state, action) => {
            state.title = action.payload;
        }
    }
});
const { reducer, actions } = slice;
export const { openMessage,openSuccess, openError, close, change_title } = actions;
export default reducer;