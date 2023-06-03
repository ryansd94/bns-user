import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    content: '',
    notifyData: { items: [], unread: 0, total: 0, currentPage: 0 },
    isReload: false
}

const slice = createSlice({
    name: 'notify',
    initialState: initialState,
    reducers: {
        setNotifyContent: (state, action) => {
            state.content = action.payload
        },
        setNotifyData: (state, action) => {
            state.notifyData = { ...state.notifyData, ...action.payload }
        },
        newNotify: (state, action) => {
            state.notifyData = { unread: state.notifyData.unread + 1, items: [action.payload, ...state.notifyData.items] }
        },
        updateReadAllNotify: (state, action) => {
            let data = { ...state.notifyData }
            _.map(data.items, (x) => {
                return x.isRead = true
            })
            data.unread = 0
            state.notifyData = { data }
        },
        reloadNotify: (state, action) => {
            state.isReload = !state.isReload
        },
    }
})

const { reducer, actions } = slice
export const { setNotifyContent, setNotifyData, newNotify, updateReadAllNotify, reloadNotify } = actions
export default reducer