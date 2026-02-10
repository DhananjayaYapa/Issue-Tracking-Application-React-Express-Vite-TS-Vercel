import React from 'react'
import { Box, Typography } from '@mui/material'

interface WelcomeMessageProps {
  userName?: string
  message?: string
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  userName = 'User',
  message = 'Welcome Back User... ',
}) => {
  const firstName = userName.split(' ')[0] || userName

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" fontWeight={600}>
        Welcome back, {firstName}!
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}

export default WelcomeMessage
