import { USER_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type { UserParams } from '../../utilities/models'

// Fetch all users
const fetchUsers = () => ({
  type: USER_ACTION_TYPES.FETCH_USERS + COMMON_ACTION_TYPES.REQUEST,
})

// Fetch single user
const fetchUser = (params: UserParams) => ({
  type: USER_ACTION_TYPES.FETCH_USER + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Delete user (disable)
const deleteUser = (params: UserParams) => ({
  type: USER_ACTION_TYPES.DELETE_USER + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Enable user
const enableUser = (params: UserParams) => ({
  type: USER_ACTION_TYPES.ENABLE_USER + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Permanent delete user
const permanentDeleteUser = (params: UserParams) => ({
  type: USER_ACTION_TYPES.PERMANENT_DELETE_USER + COMMON_ACTION_TYPES.REQUEST,
  params,
})

export const userActions = {
  fetchUsers,
  fetchUser,
  deleteUser,
  enableUser,
  permanentDeleteUser,
}
