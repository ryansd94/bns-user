import { configureStore } from "@reduxjs/toolkit";
import popupReducer from "components/popup/popupSlice";
import snackbarReducer from "stores/components/snackbar";
import tableReducer from "stores/components/table";
import alertDialogReducer from "stores/components/alert-dialog";
import masterReducer from "stores/views/master";
import buttonReducer from "stores/components/button";
import userReducer from "stores/views/user";

const rootReducer = {
  popup: popupReducer,
  snackbar: snackbarReducer,
  table: tableReducer,
  master: masterReducer,
  alertDialog: alertDialogReducer,
  button: buttonReducer,
  user:userReducer
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
