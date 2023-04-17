import { createSlice } from "@reduxjs/toolkit"
import { VisibleDefault } from 'configs/enums'

const initialState = {
    columnVisibility: {
        createdDate: true,
        edit: true,
        name: true,
        color: true,
        id: false,
        description: true,
        __check__: true,
    },
    filters: []
}

const slice = createSlice({
    name: "priority",
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
