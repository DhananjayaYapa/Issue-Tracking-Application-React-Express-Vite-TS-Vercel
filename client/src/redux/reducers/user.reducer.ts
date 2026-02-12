import { USER_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type { User } from '../../utilities/models'

export interface UserManagementState {
  users: User[]
  currentUser: User | null
  isLoading: boolean
  error: string | null
}

const INITIAL_STATE: UserManagementState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
}

// User Reducer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userReducer = (state = INITIAL_STATE, action: any): UserManagementState => {
  switch (action.type) {
    // Fetch Users
    case USER_ACTION_TYPES.FETCH_USERS + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case USER_ACTION_TYPES.FETCH_USERS + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        users: action.data,
        error: null,
      }
    case USER_ACTION_TYPES.FETCH_USERS + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Fetch Single User
    case USER_ACTION_TYPES.FETCH_USER + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case USER_ACTION_TYPES.FETCH_USER + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentUser: action.data,
        error: null,
      }
    case USER_ACTION_TYPES.FETCH_USER + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Delete User (Disable)
    case USER_ACTION_TYPES.DELETE_USER + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case USER_ACTION_TYPES.DELETE_USER + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      }
    case USER_ACTION_TYPES.DELETE_USER + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Enable User
    case USER_ACTION_TYPES.ENABLE_USER + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case USER_ACTION_TYPES.ENABLE_USER + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
      }
    case USER_ACTION_TYPES.ENABLE_USER + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Permanent Delete User
    case USER_ACTION_TYPES.PERMANENT_DELETE_USER + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case USER_ACTION_TYPES.PERMANENT_DELETE_USER + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        users: state.users.filter((user) => user.userId !== action.data),
        error: null,
      }
    case USER_ACTION_TYPES.PERMANENT_DELETE_USER + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Clear Error
    case USER_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

export default userReducer
