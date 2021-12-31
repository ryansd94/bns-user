import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open: false,
    title: '',
    content: null
}


const popup = createSlice({
    name: 'photos',
    initialState: initialState,
    reducers: {
        open: (state, action) => {
            // const newPhoto = action.payload;
            state.open = true;
        },
        close: (state, action) => {
            state.open = false;
        },
        change_title: (state, action) => {
            state.title=action.payload;
        }
    }
});
const { reducer, actions } = popup;
export const { open, close, change_title } = actions ;
export default reducer;