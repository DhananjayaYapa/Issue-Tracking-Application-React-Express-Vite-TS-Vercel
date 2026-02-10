import { useSelector } from 'react-redux'
import { Paper, Button, Box, Switch, FormControlLabel, TextField } from '@mui/material'
import { FilterSelect } from '../../shared'
import { ISSUE_STATUS, ISSUE_PRIORITY } from '../../../utilities/constants'
import type { IssueFiltersDto as IssueFiltersType } from '../../../utilities/models'
import type { RootState } from '../../../redux/store'
import styles from './IssueFilters.module.scss'

interface UserOption {
  value: string
  label: string
}

interface IssueFiltersProps {
  filters: IssueFiltersType
  fromDate: string
  toDate: string
  onFromDateChange: (value: string) => void
  onToDateChange: (value: string) => void
  onFilterChange: (key: keyof IssueFiltersType, value: string) => void
  onApply: () => void
  loading?: boolean
  showStatusIcons: boolean
  showPriorityIcons: boolean
  onToggleStatusIcons: () => void
  onTogglePriorityIcons: () => void
  showCreatedBy?: boolean
  userOptions?: UserOption[]
  createdByValue?: string
  onCreatedByChange?: (value: string) => void
}

// IssueFilters - Filter bar for issues list
const IssueFilters: React.FC<IssueFiltersProps> = ({
  filters,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onFilterChange,
  onApply,
  loading = false,
  showStatusIcons,
  showPriorityIcons,
  onToggleStatusIcons,
  onTogglePriorityIcons,
  showCreatedBy = false,
  userOptions = [],
  createdByValue = '',
  onCreatedByChange,
}) => {
  const metadata = useSelector((state: RootState) => state.issues.metadata)

  const statusOptions = (metadata?.statuses || Object.values(ISSUE_STATUS)).map((s) => ({
    value: s,
    label: s,
  }))

  const priorityOptions = (metadata?.priorities || Object.values(ISSUE_PRIORITY)).map((p) => ({
    value: p,
    label: p,
  }))

  return (
    <Paper className={styles.filters}>
      <FilterSelect
        label="Status"
        value={filters.status || ''}
        options={statusOptions}
        onChange={(value) => onFilterChange('status', value)}
      />

      <FilterSelect
        label="Priority"
        value={filters.priority || ''}
        options={priorityOptions}
        onChange={(value) => onFilterChange('priority', value)}
      />

      <TextField
        label="From Date"
        type="date"
        size="small"
        value={fromDate}
        onChange={(e) => onFromDateChange(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: 50 } }}
      />

      <TextField
        label="To Date"
        type="date"
        size="small"
        value={toDate}
        onChange={(e) => onToDateChange(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: 50 } }}
      />

      {showCreatedBy && onCreatedByChange && (
        <FilterSelect
          label="Created By"
          value={createdByValue}
          options={userOptions}
          onChange={onCreatedByChange}
        />
      )}

      <Button variant="outlined" onClick={onApply} disabled={loading}>
        Apply
      </Button>

      <Box sx={{ ml: 'auto', display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Switch
              checked={showStatusIcons}
              onChange={onToggleStatusIcons}
              size="small"
              color="primary"
            />
          }
          label="Status Icons"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showPriorityIcons}
              onChange={onTogglePriorityIcons}
              size="small"
              color="primary"
            />
          }
          label="Priority Icons"
        />
      </Box>
    </Paper>
  )
}

export default IssueFilters
