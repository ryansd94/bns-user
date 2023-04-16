import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    columnVisibility: {
        createdDate: true,
        edit: true,
        name: true,
        description: true,
        templateName: true,
        icon: true,
        id: false,
        __check__: true,
    },
    editId: null
}

const slice = createSlice({
    name: "permission",
    initialState: initialState,
    reducers: {
        setColumnVisibility: (state, action) => {
            state.columnVisibility = action.payload
        },
        setEditId: (state, action) => {
            state.columnVisibility = action.payload
        },
    },
})

const { reducer, actions } = slice
export const { setColumnVisibility } = actions
export default reducer
