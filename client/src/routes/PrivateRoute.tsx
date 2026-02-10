import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { authActions } from '../redux/actions'
import { APP_ROUTES } from '../utilities/constants'

interface PrivateRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  // Fetch user profile if authenticated but user data is missing (happens on page refresh)
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(authActions.fetchProfileRequest())
    }
  }, [isAuthenticated, user, dispatch])

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />
  }

  // Wait for user data to load before checking roles
  if (!user) {
    return null
  }

  // Check role-based access
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      const fallback = APP_ROUTES.DASHBOARD
      return <Navigate to={fallback} replace />
    }
  }

  return <>{children}</>
}

export default PrivateRoute
