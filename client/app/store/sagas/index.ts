import { all } from "redux-saga/effects";
import { authSaga } from "./authSaga";
import { jobSaga } from "./jobSaga";
import { companySaga } from "./companySaga";

export default function* rootSaga() {
    yield all([authSaga(), jobSaga(), companySaga()]); // Placeholder for future sagas
}
