import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Divider,
  Avatar,
  Snackbar,
} from '@mui/material'
import { Person as PersonIcon, Save as SaveIcon, Lock as LockIcon } from '@mui/icons-material'
import { authActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import { PageHeader } from '../../components/shared'
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

  return (
    <Box className={styles.profileContainer}>
      <PageHeader title="Profile" subtitle="Manage your account settings" />

      <Grid container spacing={3}>
        <Grid>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 56,
                  height: 56,
                  mr: 2,
                }}
              >
                <PersonIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Profile Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update your personal details
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {error && !passwordSuccess && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleUpdateProfile}>
              <TextField
                label="Email"
                value={user?.email || ''}
                fullWidth
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                label="Role"
                value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
                fullWidth
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
                placeholder="Enter your name"
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={isLoading || !name.trim()}
                fullWidth
              >
                {isLoading ? 'Saving...' : 'Update Profile'}
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: 'warning.main',
                  width: 56,
                  height: 56,
                  mr: 2,
                }}
              >
                <LockIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Change Password
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update your account password
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}

            {error && passwordSuccess && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleChangePassword}>
              <TextField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                placeholder="Enter current password"
              />
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                placeholder="Enter new password"
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
                placeholder="Confirm new password"
              />
              <Button
                type="submit"
                variant="contained"
                color="warning"
                startIcon={<LockIcon />}
                disabled={isLoading}
                fullWidth
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </Button>
            </form>
          </Paper>
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
