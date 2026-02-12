import { USER_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type { User } from '../../utilities/models'

// Nested state structure matching admin-react-poc pattern
interface ActionState<T> {
  isLoading: boolean
  data: T
  error: string | null
}

export interface UserManagementState {
  fetchUsers: ActionState<User[]>
  fetchUser: ActionState<User | null>
  deleteUser: ActionState<unknown>
  enableUser: ActionState<unknown>
  permanentDeleteUser: ActionState<unknown>
}

const INITIAL_STATE: UserManagementState = {
  fetchUsers: { isLoading: false, data: [], error: null },
  fetchUser: { isLoading: false, data: null, error: null },
  deleteUser: { isLoading: false, data: null, error: null },
  enableUser: { isLoading: false, data: null, error: null },
  permanentDeleteUser: { isLoading: false, data: null, error: null },
}

// User Reducer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userReducer = (state = INITIAL_STATE, action: any): UserManagementState => {
  switch (action.type) {
    // Fetch Users
    case USER_ACTION_TYPES.FETCH_USERS + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        fetchUsers: { ...state.fetchUsers, isLoading: true, error: null },
      }
    case USER_ACTION_TYPES.FETCH_USERS + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        fetchUsers: { isLoading: false, data: action.data, error: null },
      }
    case USER_ACTION_TYPES.FETCH_USERS + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        fetchUsers: { ...state.fetchUsers, isLoading: false, error: action.error },
      }

    // Fetch Single User
    case USER_ACTION_TYPES.FETCH_USER + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        fetchUser: { ...state.fetchUser, isLoading: true, error: null },
      }
    case USER_ACTION_TYPES.FETCH_USER + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        fetchUser: { isLoading: false, data: action.data, error: null },
      }
    case USER_ACTION_TYPES.FETCH_USER + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        fetchUser: { ...state.fetchUser, isLoading: false, error: action.error },
      }

    // Delete User (Disable)
    case USER_ACTION_TYPES.DELETE_USER + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        deleteUser: { ...state.deleteUser, isLoading: true, error: null },
      }
    case USER_ACTION_TYPES.DELETE_USER + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        deleteUser: { isLoading: false, data: action.data, error: null },
      }
    case USER_ACTION_TYPES.DELETE_USER + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        deleteUser: { ...state.deleteUser, isLoading: false, error: action.error },
      }

    // Enable User
    case USER_ACTION_TYPES.ENABLE_USER + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        enableUser: { ...state.enableUser, isLoading: true, error: null },
      }
    case USER_ACTION_TYPES.ENABLE_USER + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        enableUser: { isLoading: false, data: action.data, error: null },
      }
    case USER_ACTION_TYPES.ENABLE_USER + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        enableUser: { ...state.enableUser, isLoading: false, error: action.error },
      }

    // Permanent Delete User
    case USER_ACTION_TYPES.PERMANENT_DELETE_USER + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        permanentDeleteUser: { ...state.permanentDeleteUser, isLoading: true, error: null },
      }
    case USER_ACTION_TYPES.PERMANENT_DELETE_USER + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        permanentDeleteUser: { isLoading: false, data: action.data, error: null },
      }
    case USER_ACTION_TYPES.PERMANENT_DELETE_USER + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        permanentDeleteUser: {
          ...state.permanentDeleteUser,
          isLoading: false,
          error: action.error,
        },
      }

    default:
      return state
  }
}

export default userReducer
