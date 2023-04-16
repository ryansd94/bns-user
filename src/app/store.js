import { configureStore } from "@reduxjs/toolkit"
import popupReducer from "components/popup/popupSlice"
import snackbarReducer from "stores/components/snackbar"
import tableReducer from "stores/components/table"
import alertDialogReducer from "stores/components/alert-dialog"
import masterReducer from "stores/views/master"
import buttonReducer from "stores/components/button"
import userReducer from "stores/views/user"
import templateReducer from "stores/views/template"
import statusReducer from "stores/views/status"
import teamReducer from "stores/views/team"
import taskTypeReducer from "stores/views/taskType"
import taskReducer from "stores/views/task"
import priorityReducer from "stores/views/priority"
import projectReducer from "stores/views/project"
import permissionReducer from "stores/views/permission"
import menuReducer from "stores/components/menu"


const rootReducer = {
  popup: popupReducer,
  snackbar: snackbarReducer,
  table: tableReducer,
  master: masterReducer,
  alertDialog: alertDialogReducer,
  button: buttonReducer,
  user: userReducer,
  template: templateReducer,
  status: statusReducer,
  team: teamReducer,
  taskType: taskTypeReducer,
  task: taskReducer,
  priority: priorityReducer,
  project: projectReducer,
  permission: permissionReducer,
  menu: menuReducer
}

const store = configureStore({
  reducer: rootReducer,
})

export default store
