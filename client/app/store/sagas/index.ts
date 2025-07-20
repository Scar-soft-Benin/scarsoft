import { all } from "redux-saga/effects";
import { authSaga } from "./authSaga";
import { jobSaga } from "./jobSaga";
import { companySaga } from "./companySaga";
import { jobApplySaga } from "./jobApplySaga";
import { contactSaga } from "./contactSaga";
import { notificationSaga } from "./notificationSaga";
import { statisticsSaga } from "./statisticsSaga";

export default function* rootSaga() {
    yield all([
        authSaga(),
        jobSaga(),
        companySaga(),
        jobApplySaga(),
        contactSaga(),
        notificationSaga(),
        statisticsSaga()
    ]); // Placeholder for future sagas
}
