/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from 'redux-saga/effects'
import { authService } from '../../services'
import { authActions } from '../actions'
import { AUTH_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type {
  LoginPayload,
  RegisterPayload,
  ApiResponseDto,
  AuthResponseDto,
  User,
} from '../../utilities/models'
import type { AxiosResponse } from 'axios'

function* loginSaga(action: { type: string; payload: LoginPayload }) {
  try {
    const response: AxiosResponse<ApiResponseDto<AuthResponseDto>> = yield call(
      authService.login,
      action.payload
    )

    // Store token in localStorage
    yield call(authService.setToken, response.data.data.token)

    yield put(
      authActions.loginSuccess({
        user: response.data.data.user,
        token: response.data.data.token,
      })
    )
  } catch (error: any) {
    yield put(authActions.loginError(error))
  }
}

// Register saga
function* registerSaga(action: { type: string; payload: RegisterPayload }) {
  try {
    const response: AxiosResponse<ApiResponseDto<AuthResponseDto>> = yield call(
      authService.register,
      action.payload
    )

    // Store token in localStorage
    yield call(authService.setToken, response.data.data.token)

    yield put(
      authActions.registerSuccess({
        user: response.data.data.user,
        token: response.data.data.token,
      })
    )
  } catch (error: any) {
    yield put(authActions.registerError(error))
  }
}

// Logout saga
function* logoutSaga() {
  try {
    yield call(authService.logout)
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Fetch profile saga
function* fetchProfileSaga() {
  try {
    const response: AxiosResponse<ApiResponseDto<User>> = yield call(authService.getProfile)
    yield put(authActions.fetchProfileSuccess(response.data.data))
  } catch (error: any) {
    yield put(authActions.fetchProfileError(error))
  }
}

// Update profile saga
function* updateProfileSaga(action: { type: string; payload: { name: string } }) {
  try {
    const response: AxiosResponse<ApiResponseDto<User>> = yield call(
      authService.updateProfile,
      action.payload
    )
    yield put(authActions.updateProfileSuccess(response.data.data))
  } catch (error: any) {
    yield put(authActions.updateProfileError(error))
  }
}

// Change password saga
function* changePasswordSaga(action: {
  type: string
  payload: { currentPassword: string; newPassword: string }
}) {
  try {
    yield call(authService.changePassword, action.payload)
    yield put(authActions.changePasswordSuccess())
  } catch (error: any) {
    yield put(authActions.changePasswordError(error))
  }
}

// Watcher saga
export default function* authSaga() {
  yield takeLatest(AUTH_ACTION_TYPES.LOGIN + COMMON_ACTION_TYPES.REQUEST, loginSaga)
  yield takeLatest(AUTH_ACTION_TYPES.REGISTER + COMMON_ACTION_TYPES.REQUEST, registerSaga)
  yield takeLatest(AUTH_ACTION_TYPES.LOGOUT + COMMON_ACTION_TYPES.REQUEST, logoutSaga)
  yield takeLatest(AUTH_ACTION_TYPES.FETCH_PROFILE + COMMON_ACTION_TYPES.REQUEST, fetchProfileSaga)
  yield takeLatest(
    AUTH_ACTION_TYPES.UPDATE_PROFILE + COMMON_ACTION_TYPES.REQUEST,
    updateProfileSaga
  )
  yield takeLatest(
    AUTH_ACTION_TYPES.CHANGE_PASSWORD + COMMON_ACTION_TYPES.REQUEST,
    changePasswordSaga
  )
}
