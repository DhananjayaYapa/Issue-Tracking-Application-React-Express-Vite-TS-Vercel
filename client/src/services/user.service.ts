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

export const userService = {
  getUsers,
  getUser,
  deleteUser,
}
