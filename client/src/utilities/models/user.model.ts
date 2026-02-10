import type { User } from './auth.model'

export interface UserManagementStateDto {
  users: User[]
  currentUser: User | null
  isLoading: boolean
  error: string | null
}
