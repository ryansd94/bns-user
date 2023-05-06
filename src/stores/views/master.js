import { createSlice } from "@reduxjs/toolkit"
import { VisibleDefault } from 'configs/enums'
import { getUserInfo } from "helpers"
import _ from 'lodash'

const initialState = {
  page: 0,
  pageSize: null,
  loading: false,
  data: [],
  isReload: null,
  loadingPopup: false,
  editData: "",
  filterModel: [],
  toolbarVisible: { ...VisibleDefault },
  deleteData: {},
  userSetting: {},
  actionActive: ''
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
      if (state.isReload != null) {
        state.isReload = !state.isReload
      } else {
        state.isReload = true
      }
    },
    setReloadNull: (state, action) => {
      state.isReload = null
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
    setDeleteData: (state, action) => {
      state.deleteData = action.payload
    },
    setUserSetting: (state, action) => {
      if (_.isEmpty(state.userSetting)) {
        const user = getUserInfo()
        state.userSetting = { ...user, ...action.payload }
      } else {
        state.userSetting = { ...state.userSetting, ...action.payload }
      }
    },
    setActionActive: (state, action) => {
      state.actionActive = action.payload
    },
  },
})
const { reducer, actions } = slice
export const { setData, setLoading, setPage, setReload, setSort,
  setLoadingPopup, setEditData, setPageSize, setFilter, setToolbarVisibility,
  setReloadNull, setDeleteData, setUserSetting, setActionActive } = actions
export default reducer
