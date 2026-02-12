import { all, fork } from 'redux-saga/effects'
import authSaga from './auth.saga'
import issueSaga from './issue.saga'
import userSaga from './user.saga'
import alertSaga from './alert.saga'

export default function* rootSaga() {
  yield all([fork(authSaga), fork(issueSaga), fork(userSaga), fork(alertSaga)])
}
