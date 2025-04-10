import { configureStore } from "@reduxjs/toolkit";
import navReducer from "./navSlice";
import modalReducer from "./modalSlice";
import sidebarReducer from "./sideBar";
import loadingReducer from "./loadingSlice";
import stockOptionReducer from "./stockOptionsSlice"
import copyTradeReducer from "./copyTradeSlice";

export const store = configureStore({
  reducer: {
    nav: navReducer,
    sidebar: sidebarReducer,
    modal: modalReducer,
    stockOption: stockOptionReducer,
    copyTrade: copyTradeReducer,
    loading: loadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
