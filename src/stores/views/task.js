import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    columnVisibility: {
        createdDate: true,
        edit: true,
        title: true,
        "taskType.name": true,
        "status.name": true,
        createdDate: true,
        "createUser.name": true,
        id: false,
        __check__: true,
    },
    toolbarVisible: {
        add: false,
        column: true,
        function: false,
        delete: false
    },
    task: {
        template: null
    }
}

const slice = createSlice({
    name: "task",
    initialState: initialState,
    reducers: {
        setColumnVisibility: (state, action) => {
            state.columnVisibility = action.payload
        },
        setTemplate: (state, action) => {
            state.task.template = action.payload.template
        },
    },
})
const { reducer, actions } = slice
export const { setColumnVisibility, setTemplate } = actions
export default reducer
