import { all } from "redux-saga/effects";
import { authSaga } from "./authSaga";
import { jobSaga } from "./jobSaga";
import { companySaga } from "./companySaga";
import { jobApplySaga } from "./jobApplySaga";

export default function* rootSaga() {
    yield all([authSaga(), jobSaga(), companySaga(), jobApplySaga()]); // Placeholder for future sagas
}
