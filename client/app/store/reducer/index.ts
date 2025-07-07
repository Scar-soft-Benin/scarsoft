import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authReducer";
import messageReducer from "./messageReducer";
import loadingReducer from "./loadingReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    message: messageReducer,
    loading: loadingReducer
});

export default rootReducer;
