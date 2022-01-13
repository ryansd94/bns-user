import { configureStore } from "@reduxjs/toolkit";
import popupReducer from 'components/popup/popupSlice';
import snackbarReducer from 'stores/components/snackbar';
import tableReducer from 'stores/components/table';
import masterReducer from 'stores/views/master';

const rootReducer = {
    popup: popupReducer,
    snackbar: snackbarReducer,
    table: tableReducer,
    master: masterReducer
}

const store = configureStore({
    reducer: rootReducer,
});

export default store;