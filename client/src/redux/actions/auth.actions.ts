/* eslint-disable @typescript-eslint/no-explicit-any */
import { AUTH_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type { LoginPayload, RegisterPayload } from '../../utilities/models'

const loginRequest = (payload: LoginPayload) => ({
  type: AUTH_ACTION_TYPES.LOGIN + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

const loginSuccess = (data: { user: any; token: string }) => ({
  type: AUTH_ACTION_TYPES.LOGIN + COMMON_ACTION_TYPES.SUCCESS,
  data,
})

const loginError = (error: string) => ({
  type: AUTH_ACTION_TYPES.LOGIN + COMMON_ACTION_TYPES.ERROR,
  error,
})

const registerRequest = (payload: RegisterPayload) => ({
  type: AUTH_ACTION_TYPES.REGISTER + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

const registerSuccess = (data: { user: any; token: string }) => ({
  type: AUTH_ACTION_TYPES.REGISTER + COMMON_ACTION_TYPES.SUCCESS,
  data,
})

const registerError = (error: string) => ({
  type: AUTH_ACTION_TYPES.REGISTER + COMMON_ACTION_TYPES.ERROR,
  error,
})

const logout = () => ({
  type: AUTH_ACTION_TYPES.LOGOUT + COMMON_ACTION_TYPES.REQUEST,
})

const fetchProfileRequest = () => ({
  type: AUTH_ACTION_TYPES.FETCH_PROFILE + COMMON_ACTION_TYPES.REQUEST,
})

const fetchProfileSuccess = (data: any) => ({
  type: AUTH_ACTION_TYPES.FETCH_PROFILE + COMMON_ACTION_TYPES.SUCCESS,
  data,
})

const fetchProfileError = (error: string) => ({
  type: AUTH_ACTION_TYPES.FETCH_PROFILE + COMMON_ACTION_TYPES.ERROR,
  error,
})

const clearError = () => ({
  type: AUTH_ACTION_TYPES.CLEAR_ERROR,
})

// Update profile
const updateProfileRequest = (payload: { name: string }) => ({
  type: AUTH_ACTION_TYPES.UPDATE_PROFILE + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

const updateProfileSuccess = (data: any) => ({
  type: AUTH_ACTION_TYPES.UPDATE_PROFILE + COMMON_ACTION_TYPES.SUCCESS,
  data,
})

const updateProfileError = (error: string) => ({
  type: AUTH_ACTION_TYPES.UPDATE_PROFILE + COMMON_ACTION_TYPES.ERROR,
  error,
})

// Change password
const changePasswordRequest = (payload: { currentPassword: string; newPassword: string }) => ({
  type: AUTH_ACTION_TYPES.CHANGE_PASSWORD + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

const changePasswordSuccess = () => ({
  type: AUTH_ACTION_TYPES.CHANGE_PASSWORD + COMMON_ACTION_TYPES.SUCCESS,
})

const changePasswordError = (error: string) => ({
  type: AUTH_ACTION_TYPES.CHANGE_PASSWORD + COMMON_ACTION_TYPES.ERROR,
  error,
})

export const authActions = {
  loginRequest,
  loginSuccess,
  loginError,
  registerRequest,
  registerSuccess,
  registerError,
  logout,
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileError,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileError,
  changePasswordRequest,
  changePasswordSuccess,
  changePasswordError,
  clearError,
}
