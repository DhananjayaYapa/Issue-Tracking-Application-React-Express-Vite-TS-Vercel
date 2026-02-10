import React from 'react'
import { Box, Typography, Button } from '@mui/material'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actionLabel?: string
  actionIcon?: React.ReactNode
  onAction?: () => void
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onAction,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight={600}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {actionLabel && onAction && (
        <Button variant="contained" startIcon={actionIcon} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}

export default PageHeader
