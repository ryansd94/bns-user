import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading: false
}

const slice = createSlice({
    name: 'button',
    initialState: initialState,
    reducers: {
        loading: (state, action) => {
            state.loading = action.payload
        }
    }
})

const { reducer, actions } = slice
export const { loading } = actions
export default reducer