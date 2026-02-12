import React from 'react'
import { Paper, TextField, Button, Box, Typography, Alert, Divider, Avatar } from '@mui/material'
import { Lock as LockIcon } from '@mui/icons-material'

interface PasswordChangeProps {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  onCurrentPasswordChange: (value: string) => void
  onNewPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  error: string | null
}

const PasswordChange: React.FC<PasswordChangeProps> = ({
  currentPassword,
  newPassword,
  confirmPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  isLoading,
  error,
}) => {
  return (
    <Paper sx={{ p: 3, height: '100%' }}>
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={onSubmit}>
        <TextField
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => onCurrentPasswordChange(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="Enter current password"
        />
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => onNewPasswordChange(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="Enter new password"
        />
        <TextField
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
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
  )
}

export default PasswordChange
