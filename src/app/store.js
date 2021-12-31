import { configureStore } from "@reduxjs/toolkit";
import popupReducer from 'components/popup/popupSlice';

const rootReducer = {
    popup: popupReducer,
}

const store = configureStore({
    reducer: rootReducer,
});

export default store;