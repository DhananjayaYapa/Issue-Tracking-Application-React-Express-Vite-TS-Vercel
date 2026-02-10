import axios from 'axios'
import { exceptionHandler } from '../core'

//default base URL
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

//Public Axios Instance For unauthenticated requests
export const axiosPublicInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

//Private Axios Instance For authenticated requests (requires JWT token)
export const axiosPrivateInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Private instance - Add Authorization header
axiosPrivateInstance.interceptors.request.use(
  async (request) => {
    const token = localStorage.getItem('token')
    if (token && request.headers) {
      request.headers.Authorization = `Bearer ${token}`
    }
    return request
  },
  (error) => {
    console.error('Request Interceptor Error:', error)
    return Promise.reject(error)
  }
)

// Response Interceptors
axiosPrivateInstance.interceptors.response.use(
  async (response) => {
    return response
  },
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(await exceptionHandler(error.response))
  }
)

axiosPublicInstance.interceptors.response.use(
  async (response) => {
    return response
  },
  async (error) => {
    return Promise.reject(await exceptionHandler(error.response))
  }
)

export * from './auth.service'
export * from './issue.service'
export * from './user.service'
