import { createSlice } from "@reduxjs/toolkit"
import { VisibleDefault } from 'configs/enums'

const initialState = {
    columnVisibility: {
        createdDate: true,
        edit: true,
        name: true,
        description: true,
        id: false,
        __check__: true,
    },
    statusData: []
}

const slice = createSlice({
    name: "template",
    initialState: initialState,
    reducers: {
        setColumnVisibility: (state, action) => {
            state.columnVisibility = action.payload
        },
        setStatus: (state, action) => {
            state.statusData = action.payload
        },
    },
})
const { reducer, actions } = slice
export const { setColumnVisibility, setStatus } = actions
export default reducer
