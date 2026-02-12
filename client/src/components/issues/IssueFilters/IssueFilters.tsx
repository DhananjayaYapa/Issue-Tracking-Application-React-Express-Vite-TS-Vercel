import { useSelector } from 'react-redux'
import { Paper, Button, TextField, InputAdornment, Box, Grid, Typography } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
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
  onReset: () => void
  loading?: boolean
  showCreatedBy?: boolean
  userOptions?: UserOption[]
  createdByValue?: string
  onCreatedByChange?: (value: string) => void
  searchValue?: string
  onSearchChange?: (value: string) => void
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
  onReset,
  loading = false,
  showCreatedBy = false,
  userOptions = [],
  createdByValue = '',
  onCreatedByChange,
  searchValue = '',
  onSearchChange,
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

  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <Paper className={styles.filters}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={12} md={12} lg={12} mb={1}>
            <Typography variant="h6" fontWeight={600}>
              Search & Filter Issues
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex' }}>
          <Grid container spacing={2} alignItems="center" mt={1}>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                size="small"
                value={fromDate}
                onChange={(e) => onFromDateChange(e.target.value)}
                slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: today } }}
                sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: 50 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                size="small"
                value={toDate}
                onChange={(e) => onToDateChange(e.target.value)}
                slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: today } }}
                sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: 50 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <FilterSelect
                fullWidth
                label="Status"
                value={filters.status || ''}
                options={statusOptions}
                onChange={(value) => onFilterChange('status', value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <FilterSelect
                fullWidth
                label="Priority"
                value={filters.priority || ''}
                options={priorityOptions}
                onChange={(value) => onFilterChange('priority', value)}
              />
            </Grid>

            {showCreatedBy && onCreatedByChange ? (
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <FilterSelect
                  fullWidth
                  label="Created By"
                  value={createdByValue}
                  options={userOptions}
                  onChange={onCreatedByChange}
                />
              </Grid>
            ) : (
              <Grid item xs={12} sm={6} md={4} lg={2}></Grid>
            )}

            <Grid item xs={12} sm={6} md={4} lg={2} sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={onApply} disabled={loading}>
                Apply
              </Button>

              <Button variant="contained" onClick={onReset} disabled={loading}>
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search issues..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 50 } }}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default IssueFilters
