import { API_ROUTES } from '../utilities/constants'
import type { User, ApiResponseDto } from '../utilities/models'
import { axiosPrivateInstance } from './index'

const getUsers = () => {
  return axiosPrivateInstance.get<ApiResponseDto<User[]>>(API_ROUTES.USERS)
}

const getUser = (id: number) => {
  return axiosPrivateInstance.get<ApiResponseDto<User>>(API_ROUTES.USER_BY_ID(id))
}

const deleteUser = (id: number) => {
  return axiosPrivateInstance.delete(API_ROUTES.USER_BY_ID(id))
}

const enableUser = (id: number) => {
  return axiosPrivateInstance.patch(API_ROUTES.USER_ENABLE(id))
}

const permanentDeleteUser = (id: number) => {
  return axiosPrivateInstance.delete(API_ROUTES.USER_PERMANENT_DELETE(id))
}

export const userService = {
  getUsers,
  getUser,
  deleteUser,
  enableUser,
  permanentDeleteUser,
}
