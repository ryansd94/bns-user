import { configureStore } from "@reduxjs/toolkit";
import popupReducer from 'components/popup/popupSlice';
import snackbarReducer from 'components/snackbar/CustomizedSnackbarSlice';

const rootReducer = {
    popup: popupReducer,
    snackbar: snackbarReducer
}

const store = configureStore({
    reducer: rootReducer,
});

export default store;