import { USER_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type { User } from '../../utilities/models'

// Fetch all users
const fetchUsersRequest = () => ({
  type: USER_ACTION_TYPES.FETCH_USERS + COMMON_ACTION_TYPES.REQUEST,
})

const fetchUsersSuccess = (data: User[]) => ({
  type: USER_ACTION_TYPES.FETCH_USERS + COMMON_ACTION_TYPES.SUCCESS,
  data,
})

const fetchUsersError = (error: string) => ({
  type: USER_ACTION_TYPES.FETCH_USERS + COMMON_ACTION_TYPES.ERROR,
  error,
})

// Fetch single user
const fetchUserRequest = (id: number) => ({
  type: USER_ACTION_TYPES.FETCH_USER + COMMON_ACTION_TYPES.REQUEST,
  payload: id,
})

const fetchUserSuccess = (data: User) => ({
  type: USER_ACTION_TYPES.FETCH_USER + COMMON_ACTION_TYPES.SUCCESS,
  data,
})

const fetchUserError = (error: string) => ({
  type: USER_ACTION_TYPES.FETCH_USER + COMMON_ACTION_TYPES.ERROR,
  error,
})

// Delete user (disable)
const deleteUserRequest = (id: number) => ({
  type: USER_ACTION_TYPES.DELETE_USER + COMMON_ACTION_TYPES.REQUEST,
  payload: id,
})

const deleteUserSuccess = (id: number) => ({
  type: USER_ACTION_TYPES.DELETE_USER + COMMON_ACTION_TYPES.SUCCESS,
  data: id,
})

const deleteUserError = (error: string) => ({
  type: USER_ACTION_TYPES.DELETE_USER + COMMON_ACTION_TYPES.ERROR,
  error,
})

// Enable user
const enableUserRequest = (id: number) => ({
  type: USER_ACTION_TYPES.ENABLE_USER + COMMON_ACTION_TYPES.REQUEST,
  payload: id,
})

const enableUserSuccess = (id: number) => ({
  type: USER_ACTION_TYPES.ENABLE_USER + COMMON_ACTION_TYPES.SUCCESS,
  data: id,
})

const enableUserError = (error: string) => ({
  type: USER_ACTION_TYPES.ENABLE_USER + COMMON_ACTION_TYPES.ERROR,
  error,
})

// Permanent delete user
const permanentDeleteUserRequest = (id: number) => ({
  type: USER_ACTION_TYPES.PERMANENT_DELETE_USER + COMMON_ACTION_TYPES.REQUEST,
  payload: id,
})

const permanentDeleteUserSuccess = (id: number) => ({
  type: USER_ACTION_TYPES.PERMANENT_DELETE_USER + COMMON_ACTION_TYPES.SUCCESS,
  data: id,
})

const permanentDeleteUserError = (error: string) => ({
  type: USER_ACTION_TYPES.PERMANENT_DELETE_USER + COMMON_ACTION_TYPES.ERROR,
  error,
})

// Clear error
const clearError = () => ({
  type: USER_ACTION_TYPES.CLEAR_ERROR,
})

export const userActions = {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersError,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserError,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserError,
  enableUserRequest,
  enableUserSuccess,
  enableUserError,
  permanentDeleteUserRequest,
  permanentDeleteUserSuccess,
  permanentDeleteUserError,
  clearError,
}
