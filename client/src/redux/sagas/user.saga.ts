/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from 'redux-saga/effects'
import { userService } from '../../services'
import { userActions } from '../actions'
import { USER_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type { User, ApiResponseDto } from '../../utilities/models'
import type { AxiosResponse } from 'axios'

// Fetch all users saga
function* fetchUsersSaga() {
  try {
    const response: AxiosResponse<ApiResponseDto<User[]>> = yield call(userService.getUsers)
    yield put(userActions.fetchUsersSuccess(response.data.data))
  } catch (error: any) {
    yield put(userActions.fetchUsersError(error))
  }
}

// Fetch single user saga
function* fetchUserSaga(action: { type: string; payload: number }) {
  try {
    const response: AxiosResponse<ApiResponseDto<User>> = yield call(
      userService.getUser,
      action.payload
    )
    yield put(userActions.fetchUserSuccess(response.data.data))
  } catch (error: any) {
    yield put(userActions.fetchUserError(error))
  }
}

// Delete user saga
function* deleteUserSaga(action: { type: string; payload: number }) {
  try {
    yield call(userService.deleteUser, action.payload)
    yield put(userActions.deleteUserSuccess(action.payload))
  } catch (error: any) {
    yield put(userActions.deleteUserError(error))
  }
}

// Watcher saga
export default function* userSaga() {
  yield takeLatest(USER_ACTION_TYPES.FETCH_USERS + COMMON_ACTION_TYPES.REQUEST, fetchUsersSaga)
  yield takeLatest(USER_ACTION_TYPES.FETCH_USER + COMMON_ACTION_TYPES.REQUEST, fetchUserSaga)
  yield takeLatest(USER_ACTION_TYPES.DELETE_USER + COMMON_ACTION_TYPES.REQUEST, deleteUserSaga)
}
