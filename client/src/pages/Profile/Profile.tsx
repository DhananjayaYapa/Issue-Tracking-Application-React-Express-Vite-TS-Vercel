import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Grid2 as Grid, Alert } from '@mui/material'
import { authActions, alertActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import type { PasswordFormData } from '../../utilities/models'
import { validateFormData } from '../../utilities/helpers/formValidator'
import { ProfileInformation, PasswordChange } from '../../components/profile'
import styles from './Profile.module.scss'

const PASSWORD_FORM_INITIAL_STATE: PasswordFormData = {
  currentPassword: {
    value: '',
    validator: 'text',
    isRequired: true,
    error: null,
  },
  newPassword: {
    value: '',
    validator: 'text',
    isRequired: true,
    minLength: 6,
    error: null,
  },
  confirmPassword: {
    value: '',
    validator: 'text',
    isRequired: true,
    error: null,
  },
}

const Profile: React.FC = () => {
  const dispatch = useDispatch()
  const { user, isLoading } = useSelector((state: RootState) => state.auth)
  const updateProfileAlert = useSelector((state: RootState) => state.alert.updateProfileAlert)
  const changePasswordAlert = useSelector((state: RootState) => state.alert.changePasswordAlert)

  const [name, setName] = useState('')
  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData>(
    PASSWORD_FORM_INITIAL_STATE
  )

  useEffect(() => {
    if (user) {
      setName(user.name || '')
    }
  }, [user])

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    dispatch(authActions.updateProfileRequest({ name: name.trim() }))
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [validatedData, isValid]: [any, boolean] = await validateFormData(passwordFormData)

    // Custom validation for password match
    if (
      validatedData.newPassword.value &&
      validatedData.confirmPassword.value &&
      validatedData.newPassword.value !== validatedData.confirmPassword.value
    ) {
      validatedData.confirmPassword.error = 'Passwords do not match'
      setPasswordFormData(validatedData)
      return
    }

    setPasswordFormData(validatedData)
    if (!isValid) return

    dispatch(
      authActions.changePasswordRequest({
        currentPassword: validatedData.currentPassword.value,
        newPassword: validatedData.newPassword.value,
      })
    )
    setPasswordFormData(PASSWORD_FORM_INITIAL_STATE)
  }

  const handleClearUpdateProfileAlert = () => {
    dispatch(alertActions.clearUpdateProfileAlert())
  }

  const handleClearChangePasswordAlert = () => {
    dispatch(alertActions.clearChangePasswordAlert())
  }

  const handlePasswordFormChange = (property: keyof PasswordFormData, value: string) => {
    setPasswordFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property],
        value: value,
        error: null,
      },
    }))
  }

  const formattedRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''

  return (
    <Box className={styles.profileContainer}>
      {updateProfileAlert?.message && (
        <Alert
          severity={updateProfileAlert.severity ?? 'info'}
          onClose={handleClearUpdateProfileAlert}
          sx={{ mb: 2 }}
        >
          {updateProfileAlert.message}
        </Alert>
      )}

      {changePasswordAlert?.message && (
        <Alert
          severity={changePasswordAlert.severity ?? 'info'}
          onClose={handleClearChangePasswordAlert}
          sx={{ mb: 2 }}
        >
          {changePasswordAlert.message}
        </Alert>
      )}

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
            error={null}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <PasswordChange
            formData={passwordFormData}
            onFormChange={handlePasswordFormChange}
            onSubmit={handleChangePassword}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Profile
