import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material'
import { Visibility, VisibilityOff, BugReport } from '@mui/icons-material'
import { authActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import type { LoginPayload } from '../../utilities/models'
import { APP_ROUTES, APP_CONFIG } from '../../utilities/constants'
import styles from './Login.module.scss'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const { isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth)

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname || APP_ROUTES.DASHBOARD
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  useEffect(() => {
    return () => {
      dispatch(authActions.clearError())
    }
  }, [dispatch])

  const onSubmit = (data: LoginPayload) => {
    dispatch(authActions.loginRequest(data))
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Box className={styles.loginContainer}>
      <Card className={styles.loginCard} elevation={3}>
        <CardContent className={styles.cardContent}>
          <Box className={styles.header}>
            <BugReport sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight={600}>
              {APP_CONFIG.APP_NAME}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              error={!!errors.password || !!error}
              helperText={errors.password?.message || error}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword} edge="end" disabled={isLoading}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link component={RouterLink} to={APP_ROUTES.REGISTER}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login
