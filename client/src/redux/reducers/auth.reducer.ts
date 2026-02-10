import { AUTH_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type { User } from '../../utilities/models'

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  registrationSuccess: boolean
}

const INITIAL_STATE: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  registrationSuccess: false,
}

// Auth Reducer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authReducer = (state = INITIAL_STATE, action: any): AuthState => {
  switch (action.type) {
    // Login
    case AUTH_ACTION_TYPES.LOGIN + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case AUTH_ACTION_TYPES.LOGIN + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.data.user,
        token: action.data.token,
        error: null,
      }
    case AUTH_ACTION_TYPES.LOGIN + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.error,
      }

    // Register
    case AUTH_ACTION_TYPES.REGISTER + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
        registrationSuccess: false,
      }
    case AUTH_ACTION_TYPES.REGISTER + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
        registrationSuccess: true,
      }
    case AUTH_ACTION_TYPES.REGISTER + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.error,
      }

    // Logout
    case AUTH_ACTION_TYPES.LOGOUT + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...INITIAL_STATE,
        token: null,
        isAuthenticated: false,
      }

    // Fetch Profile
    case AUTH_ACTION_TYPES.FETCH_PROFILE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case AUTH_ACTION_TYPES.FETCH_PROFILE + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.data,
        error: null,
      }
    case AUTH_ACTION_TYPES.FETCH_PROFILE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Update Profile
    case AUTH_ACTION_TYPES.UPDATE_PROFILE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case AUTH_ACTION_TYPES.UPDATE_PROFILE + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.data,
        error: null,
      }
    case AUTH_ACTION_TYPES.UPDATE_PROFILE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Change Password
    case AUTH_ACTION_TYPES.CHANGE_PASSWORD + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case AUTH_ACTION_TYPES.CHANGE_PASSWORD + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      }
    case AUTH_ACTION_TYPES.CHANGE_PASSWORD + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Clear Error
    case AUTH_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

export default authReducer
