import { createSlice } from "@reduxjs/toolkit"
import { VisibleDefault } from 'configs/constants'

const initialState = {
    columnVisibility: {
        createdDate: true,
        edit: true,
        email: true,
        fullName: true,
        teamName: true,
        id: false,
        status: true,
        __check__: true,
    },
    filters: []
}

const slice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setColumnVisibility: (state, action) => {
            state.columnVisibility = action.payload
        },
        setFilter: (state, action) => {
            state.filters = action.payload
        },
    },
})
const { reducer, actions } = slice
export const { setColumnVisibility, setFilter } = actions
export default reducer
