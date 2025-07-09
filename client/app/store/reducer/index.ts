import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authReducer";
import messageReducer from "./messageReducer";
import loadingReducer from "./loadingReducer";
import jobReducer from "./jobReducer";
import companyReducer from "./companyReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    message: messageReducer,
    loading: loadingReducer,
    job: jobReducer,
    company: companyReducer
});

export default rootReducer;
