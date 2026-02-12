/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from 'redux-saga/effects'
import { userService } from '../../services'
import { USER_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import { dispatchAlert } from '../../utilities/helpers'
import type { UserParams } from '../../utilities/models'

// Fetch all users saga
function* fetchUsersSaga() {
  try {
    // @ts-expect-error-ignore
    const response = yield call(userService.getUsers)
    yield put({
      type: USER_ACTION_TYPES.FETCH_USERS + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
  } catch (error: any) {
    yield put({
      type: USER_ACTION_TYPES.FETCH_USERS + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
  }
}

// Fetch single user saga
function* fetchUserSaga(action: { type: string; params: UserParams }) {
  try {
    // @ts-expect-error-ignore
    const response = yield call(userService.getUser, action.params)
    yield put({
      type: USER_ACTION_TYPES.FETCH_USER + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
  } catch (error: any) {
    yield put({
      type: USER_ACTION_TYPES.FETCH_USER + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
  }
}

// Delete user saga (disable)
function* deleteUserSaga(action: { type: string; params: UserParams }) {
  try {
    // @ts-expect-error-ignore
    const response = yield call(userService.deleteUser, action.params)
    yield put({
      type: USER_ACTION_TYPES.DELETE_USER + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data,
    })
    yield* dispatchAlert(USER_ACTION_TYPES.DELETE_USER, 'User disabled successfully', 'success')
    yield put({
      type: USER_ACTION_TYPES.FETCH_USERS + COMMON_ACTION_TYPES.REQUEST,
    })
  } catch (error: any) {
    yield put({
      type: USER_ACTION_TYPES.DELETE_USER + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
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
function* enableUserSaga(action: { type: string; params: UserParams }) {
  try {
    // @ts-expect-error-ignore
    const response = yield call(userService.enableUser, action.params)
    yield put({
      type: USER_ACTION_TYPES.ENABLE_USER + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data,
    })
    yield* dispatchAlert(USER_ACTION_TYPES.ENABLE_USER, 'User enabled successfully', 'success')
    yield put({
      type: USER_ACTION_TYPES.FETCH_USERS + COMMON_ACTION_TYPES.REQUEST,
    })
  } catch (error: any) {
    yield put({
      type: USER_ACTION_TYPES.ENABLE_USER + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
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
function* permanentDeleteUserSaga(action: { type: string; params: UserParams }) {
  try {
    // @ts-expect-error-ignore
    const response = yield call(userService.permanentDeleteUser, action.params)
    yield put({
      type: USER_ACTION_TYPES.PERMANENT_DELETE_USER + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data,
    })
    yield* dispatchAlert(
      USER_ACTION_TYPES.PERMANENT_DELETE_USER,
      'User permanently deleted successfully',
      'success'
    )
    yield put({
      type: USER_ACTION_TYPES.FETCH_USERS + COMMON_ACTION_TYPES.REQUEST,
    })
  } catch (error: any) {
    yield put({
      type: USER_ACTION_TYPES.PERMANENT_DELETE_USER + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
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
