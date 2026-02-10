import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  Paper,
  Button,
  Grid,
  TextField,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  Download as DownloadIcon,
  Description as CsvIcon,
  DataObject as JsonIcon,
} from '@mui/icons-material'
import { issueActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import type { ExportFiltersDto, User } from '../../utilities/models'
import { PageHeader, FilterSelect, StatusChip } from '../../components/shared'
import { ISSUE_STATUS, ISSUE_PRIORITY } from '../../utilities/constants'
import { issueService } from '../../services/issue.service'
import { userService } from '../../services/user.service'
import { formatDate } from '../../utilities/helpers/commonFunctions'
import styles from './IssueReport.module.scss'

const IssueReport: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { metadata } = useSelector((state: RootState) => state.issues)

  const isAdmin = user?.role === 'admin'

  const [filters, setFilters] = useState<ExportFiltersDto>({})
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reportData, setReportData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [viewed, setViewed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const downloadMenuOpen = Boolean(anchorEl)

  useEffect(() => {
    dispatch(issueActions.fetchMetadataRequest())
    if (isAdmin) {
      userService.getUsers().then((res) => {
        setUsers(res.data.data || [])
      })
    }
  }, [dispatch, isAdmin])

  const statusOptions = (metadata?.statuses || Object.values(ISSUE_STATUS)).map((s) => ({
    value: s,
    label: s,
  }))

  const priorityOptions = (metadata?.priorities || Object.values(ISSUE_PRIORITY)).map((p) => ({
    value: p,
    label: p,
  }))

  const userOptions = users.map((u) => ({
    value: String(u.userId),
    label: u.name,
  }))

  const buildFilterParams = (): ExportFiltersDto => {
    const params: ExportFiltersDto = {}
    if (filters.status) params.status = filters.status
    if (filters.priority) params.priority = filters.priority
    if (fromDate) params.fromDate = fromDate
    if (toDate) params.toDate = toDate
    if (isAdmin && filters.createdBy) params.createdBy = filters.createdBy
    return params
  }

  const handleViewReport = async () => {
    setLoading(true)
    setError(null)
    setViewed(true)
    setPage(0)
    try {
      const params = buildFilterParams()
      const response = await issueService.exportJson(params)
      const text = await (response.data as Blob).text()
      const json = JSON.parse(text)
      setReportData(json.issues || [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load report')
      setReportData([])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFilters({})
    setFromDate('')
    setToDate('')
    setReportData([])
    setViewed(false)
    setError(null)
  }

  const handleDownload = async (format: 'csv' | 'json') => {
    setAnchorEl(null)
    try {
      const params = buildFilterParams()
      const response =
        format === 'csv'
          ? await issueService.exportCsv(params)
          : await issueService.exportJson(params)

      const blob = new Blob([response.data], {
        type: format === 'csv' ? 'text/csv' : 'application/json',
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const date = new Date().toISOString().split('T')[0]
      link.download = `issues-report-${date}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch {
      setError('Failed to download report')
    }
  }

  const handleFilterChange = (key: keyof ExportFiltersDto, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }))
  }

  const paginatedData = reportData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Box className={styles.reportPage}>
      <PageHeader title="Issue Report" />

      {/* Filters */}
      <Paper className={styles.filtersCard}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Report Filters
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              size="small"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              size="small"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: fromDate || undefined }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FilterSelect
              label="Status"
              value={filters.status || ''}
              options={statusOptions}
              onChange={(value) => handleFilterChange('status', value)}
              minWidth={140}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FilterSelect
              label="Priority"
              value={filters.priority || ''}
              options={priorityOptions}
              onChange={(value) => handleFilterChange('priority', value)}
              minWidth={140}
            />
          </Grid>

          {isAdmin && (
            <Grid item xs={12} sm={6} md={2}>
              <FilterSelect
                label="Created By"
                value={filters.createdBy ? String(filters.createdBy) : ''}
                options={userOptions}
                onChange={(value) => handleFilterChange('createdBy', value)}
                minWidth={140}
              />
            </Grid>
          )}
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleViewReport} disabled={loading}>
            {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            View Report
          </Button>
          <Button variant="outlined" onClick={handleReset} disabled={loading}>
            Reset
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {viewed && !loading && (
        <Paper className={styles.tableCard}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              pb: 0,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Results ({reportData.length} {reportData.length === 1 ? 'issue' : 'issues'})
            </Typography>
            {reportData.length > 0 && (
              <>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  Download
                </Button>
                <Menu anchorEl={anchorEl} open={downloadMenuOpen} onClose={() => setAnchorEl(null)}>
                  <MenuItem onClick={() => handleDownload('csv')}>
                    <ListItemIcon>
                      <CsvIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download CSV</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleDownload('json')}>
                    <ListItemIcon>
                      <JsonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download JSON</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Resolved At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography color="text.secondary" py={4}>
                        No issues found for the selected filters
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((issue) => (
                    <TableRow key={issue.id} hover>
                      <TableCell>{issue.id}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 250,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {issue.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip variant="status" value={issue.status} />
                      </TableCell>
                      <TableCell>
                        <StatusChip variant="priority" value={issue.priority} outlined />
                      </TableCell>
                      <TableCell>{issue.createdBy}</TableCell>
                      <TableCell>{issue.assignedTo || '—'}</TableCell>
                      <TableCell>{formatDate(issue.createdAt)}</TableCell>
                      <TableCell>{issue.resolvedAt ? formatDate(issue.resolvedAt) : '—'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {reportData.length > 0 && (
            <TablePagination
              component="div"
              count={reportData.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10))
                setPage(0)
              }}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          )}
        </Paper>
      )}
    </Box>
  )
}

export default IssueReport
