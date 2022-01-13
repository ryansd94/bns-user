import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    title: '',
    severity: '',
    errorCode: 'success'
}


const slice = createSlice({
    name: 'snackbar',
    initialState: initialState,
    reducers: {
        openMessage: (state, action) => {
            if (action.payload.errorCode == 'Success') {
                state.open = true;
                state.severity = "success";
            }
            else {

                state.open = true;
                state.severity = "error";
                state.title = action.payload.title;
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
export const { openMessage, close, change_title } = actions;
export default reducer;