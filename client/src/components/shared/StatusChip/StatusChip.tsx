import React from 'react'
import { Chip, type ChipProps } from '@mui/material'
import { STATUS_COLORS, PRIORITY_COLORS } from '../../../utilities/constants'
import type { IssueStatus, IssuePriority } from '../../../utilities/models'

type VariantType = 'status' | 'priority'

interface StatusChipProps {
  variant: VariantType
  value: IssueStatus | IssuePriority
  size?: ChipProps['size']
  outlined?: boolean
}

const colorMaps = {
  status: STATUS_COLORS,
  priority: PRIORITY_COLORS,
}

const StatusChip: React.FC<StatusChipProps> = ({
  variant,
  value,
  size = 'small',
  outlined = false,
}) => {
  const colorMap = colorMaps[variant]
  const color = colorMap[value] || 'default'

  return <Chip label={value} size={size} color={color} variant={outlined ? 'outlined' : 'filled'} />
}

export default StatusChip
