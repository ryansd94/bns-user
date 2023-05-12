import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    content: ''
}

const slice = createSlice({
    name: 'notify',
    initialState: initialState,
    reducers: {
        setNotifyContent: (state, action) => {
            state.content = action.payload
        }
    }
})

const { reducer, actions } = slice
export const { setNotifyContent } = actions
export default reducer