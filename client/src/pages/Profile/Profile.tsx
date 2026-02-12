import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Grid2 as Grid, Alert, Snackbar } from '@mui/material'
import { authActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import { ProfileInformation, PasswordChange } from '../../components/profile'
import styles from './Profile.module.scss'

const Profile: React.FC = () => {
  const dispatch = useDispatch()
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth)

  const [name, setName] = useState('')
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
    }
  }, [user])

  useEffect(() => {
    dispatch(authActions.clearError())
  }, [dispatch])

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    dispatch(authActions.updateProfileRequest({ name: name.trim() }))
    setProfileSuccess(true)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match')
      return
    }

    dispatch(authActions.changePasswordRequest({ currentPassword, newPassword }))
    setPasswordSuccess(true)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleCloseProfileSnackbar = () => {
    setProfileSuccess(false)
  }

  const handleClosePasswordSnackbar = () => {
    setPasswordSuccess(false)
  }

  const formattedRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''

  return (
    <Box className={styles.profileContainer}>
      <Grid
        container
        spacing={3}
        sx={{
          maxWidth: 1400,
          ml: '2px',
          mr: 'auto',
        }}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <ProfileInformation
            email={user?.email || ''}
            role={formattedRole}
            name={name}
            onNameChange={setName}
            onSubmit={handleUpdateProfile}
            isLoading={isLoading}
            error={error && !passwordSuccess ? error : null}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <PasswordChange
            currentPassword={currentPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            onCurrentPasswordChange={setCurrentPassword}
            onNewPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onSubmit={handleChangePassword}
            isLoading={isLoading}
            error={passwordError || (error && passwordSuccess ? error : null)}
          />
        </Grid>
      </Grid>

      <Snackbar
        open={profileSuccess && !error}
        autoHideDuration={3000}
        onClose={handleCloseProfileSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseProfileSnackbar} severity="success" sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={passwordSuccess && !error}
        autoHideDuration={3000}
        onClose={handleClosePasswordSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClosePasswordSnackbar} severity="success" sx={{ width: '100%' }}>
          Password changed successfully!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Profile
