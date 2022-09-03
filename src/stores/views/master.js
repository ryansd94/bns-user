import { createSlice } from "@reduxjs/toolkit"
import { VisibleDefault } from 'configs/constants'

const initialState = {
  page: 0,
  pageSize: 10,
  sortModel: [],
  loading: false,
  data: [],
  isReload: false,
  loadingPopup: false,
  editData: "",
  filterModel: [],
  toolbarVisible: { ...VisibleDefault }
}

const slice = createSlice({
  name: "master",
  initialState: initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload
      state.loading = false
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload
    },
    setSort: (state, action) => {
      state.sortModel = action.payload
    },
    setFilter: (state, action) => {
      state.filterModel = action.payload
    },
    setReload: (state, action) => {
      state.isReload = !state.isReload
    },
    setLoadingPopup: (state, action) => {
      state.loadingPopup = action.payload
    },
    setEditData: (state, action) => {
      state.editData = action.payload
    },
    setToolbarVisibility: (state, action) => {
        state.toolbarVisible = action.payload
    },
  },
})
const { reducer, actions } = slice
export const { setData, setLoading, setPage, setReload, setSort, 
  setLoadingPopup, setEditData, setPageSize, setFilter,setToolbarVisibility } = actions
export default reducer
