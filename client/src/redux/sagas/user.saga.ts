/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from 'redux-saga/effects'
import { userService } from '../../services'
import { userActions } from '../actions'
import { USER_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import { dispatchAlert } from '../../utilities/helpers'
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

// Delete user saga (disable)
function* deleteUserSaga(action: { type: string; payload: number }) {
  try {
    yield call(userService.deleteUser, action.payload)
    yield put(userActions.deleteUserSuccess(action.payload))
    yield* dispatchAlert(USER_ACTION_TYPES.DELETE_USER, 'User disabled successfully', 'success')
    yield put(userActions.fetchUsersRequest())
  } catch (error: any) {
    yield put(userActions.deleteUserError(error))
    const backendMessage =
      error?.response?.data?.message || error?.response?.data?.error || error?.message
    yield* dispatchAlert(
      USER_ACTION_TYPES.DELETE_USER,
      backendMessage || 'Failed to disable user',
      'error'
    )
  }
}

// Enable user saga
function* enableUserSaga(action: { type: string; payload: number }) {
  try {
    yield call(userService.enableUser, action.payload)
    yield put(userActions.enableUserSuccess(action.payload))
    yield* dispatchAlert(USER_ACTION_TYPES.ENABLE_USER, 'User enabled successfully', 'success')
    yield put(userActions.fetchUsersRequest())
  } catch (error: any) {
    yield put(userActions.enableUserError(error))
    const backendMessage =
      error?.response?.data?.message || error?.response?.data?.error || error?.message
    yield* dispatchAlert(
      USER_ACTION_TYPES.ENABLE_USER,
      backendMessage || 'Failed to enable user',
      'error'
    )
  }
}

// Permanent delete user saga
function* permanentDeleteUserSaga(action: { type: string; payload: number }) {
  try {
    yield call(userService.permanentDeleteUser, action.payload)
    yield put(userActions.permanentDeleteUserSuccess(action.payload))
    yield* dispatchAlert(
      USER_ACTION_TYPES.PERMANENT_DELETE_USER,
      'User permanently deleted successfully',
      'success'
    )
  } catch (error: any) {
    yield put(userActions.permanentDeleteUserError(error))
    const backendMessage =
      error?.response?.data?.message || error?.response?.data?.error || error?.message
    yield* dispatchAlert(
      USER_ACTION_TYPES.PERMANENT_DELETE_USER,
      backendMessage || 'Failed to permanently delete user',
      'error'
    )
  }
}

// Watcher saga
export default function* userSaga() {
  yield takeLatest(USER_ACTION_TYPES.FETCH_USERS + COMMON_ACTION_TYPES.REQUEST, fetchUsersSaga)
  yield takeLatest(USER_ACTION_TYPES.FETCH_USER + COMMON_ACTION_TYPES.REQUEST, fetchUserSaga)
  yield takeLatest(USER_ACTION_TYPES.DELETE_USER + COMMON_ACTION_TYPES.REQUEST, deleteUserSaga)
  yield takeLatest(USER_ACTION_TYPES.ENABLE_USER + COMMON_ACTION_TYPES.REQUEST, enableUserSaga)
  yield takeLatest(
    USER_ACTION_TYPES.PERMANENT_DELETE_USER + COMMON_ACTION_TYPES.REQUEST,
    permanentDeleteUserSaga
  )
}
