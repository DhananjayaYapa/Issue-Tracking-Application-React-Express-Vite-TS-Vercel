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
  TableContainer,
  TableHead,
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
import { issueActions, alertActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import type { ExportFiltersDto, User } from '../../utilities/models'
import { FilterSelect, StatusChip } from '../../components/shared'
import {
  ISSUE_STATUS,
  ISSUE_PRIORITY,
  EXPORT_ACTION_TYPES,
  COMMON_ACTION_TYPES,
  ALERT_CONFIGS,
  APP_TABLE_CONFIG,
} from '../../utilities/constants'
import { issueService } from '../../services/issue.service'
import { userService } from '../../services/user.service'
import { formatDate } from '../../utilities/helpers/commonFunctions'
import styles from './IssueReport.module.scss'
import { paginationSx, StyledTableCell, StyledTableRow } from '../../assets/theme/theme'

const IssueReport: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { metadata } = useSelector((state: RootState) => state.issues)
  const downloadReportAlert = useSelector((state: RootState) => state.alert.downloadReportAlert)

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
    // Load all issues by default
    loadReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const loadReport = async (overrideParams?: ExportFiltersDto) => {
    setLoading(true)
    setError(null)
    setViewed(true)
    setPage(0)
    try {
      const params = overrideParams !== undefined ? overrideParams : buildFilterParams()
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

  const handleViewReport = () => {
    loadReport()
  }

  const handleReset = () => {
    setFilters({})
    setFromDate('')
    setToDate('')
    setReportData([])
    setViewed(false)
    setError(null)
    loadReport({})
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
      dispatch({
        type: EXPORT_ACTION_TYPES.DOWNLOAD_REPORT + COMMON_ACTION_TYPES.SET_ALERT_REQ,
        message: `Report downloaded successfully as ${format.toUpperCase()}`,
        severity: 'success',
        autoClear: true,
        timeout: ALERT_CONFIGS.TIMEOUT,
      })
    } catch {
      dispatch({
        type: EXPORT_ACTION_TYPES.DOWNLOAD_REPORT + COMMON_ACTION_TYPES.SET_ALERT_REQ,
        message: 'Failed to download report',
        severity: 'error',
        autoClear: true,
        timeout: ALERT_CONFIGS.TIMEOUT,
      })
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
  const today = new Date().toISOString().split('T')[0]

  return (
    <Box className={styles.reportPage}>
      <Paper className={styles.filtersCard}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Report Filters
        </Typography>
        <Grid container spacing={2} alignItems="center" mt={1}>
          <Grid item xs={12} sm={6} lg={3}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              size="small"
              value={fromDate}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: today } }}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              size="small"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: today } }}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: fromDate || undefined }}
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={2}>
            <FilterSelect
              label="Status"
              value={filters.status || ''}
              options={statusOptions}
              onChange={(value) => handleFilterChange('status', value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={2}>
            <FilterSelect
              label="Priority"
              value={filters.priority || ''}
              options={priorityOptions}
              onChange={(value) => handleFilterChange('priority', value)}
              fullWidth
            />
          </Grid>

          {isAdmin && (
            <Grid item xs={12} sm={6} lg={2}>
              <FilterSelect
                label="Created By"
                value={filters.createdBy ? String(filters.createdBy) : ''}
                options={userOptions}
                onChange={(value) => handleFilterChange('createdBy', value)}
                minWidth={140}
                fullWidth
              />
            </Grid>
          )}
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleViewReport} disabled={loading}>
            {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            View Report
          </Button>
          <Button variant="contained" onClick={handleReset} disabled={loading}>
            Reset
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {downloadReportAlert?.message && (
        <Alert
          severity={downloadReportAlert.severity ?? 'info'}
          onClose={() => dispatch(alertActions.clearDownloadReportAlert())}
          sx={{ mb: 2 }}
        >
          {downloadReportAlert.message}
        </Alert>
      )}

      {viewed && !loading && (
        <>
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
                    sx={{ mb: '8px' }}
                  >
                    Download
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={downloadMenuOpen}
                    onClose={() => setAnchorEl(null)}
                  >
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
                  <StyledTableRow>
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell>Title</StyledTableCell>
                    <StyledTableCell>Description</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Priority</StyledTableCell>
                    <StyledTableCell>Created By</StyledTableCell>
                    <StyledTableCell>Created At</StyledTableCell>
                    <StyledTableCell>Resolved At</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {reportData.length === 0 ? (
                    <StyledTableRow>
                      <StyledTableCell colSpan={7} align="center">
                        <Typography color="text.secondary" py={4}>
                          No issues found for the selected filters
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    paginatedData.map((issue) => (
                      <StyledTableRow key={issue.id} hover>
                        <StyledTableCell>{issue.id}</StyledTableCell>
                        <StyledTableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 170,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {issue.title}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 170,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {issue.description}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                          <StatusChip variant="status" value={issue.status} />
                        </StyledTableCell>
                        <StyledTableCell>
                          <StatusChip variant="priority" value={issue.priority} outlined />
                        </StyledTableCell>
                        <StyledTableCell>{issue.createdBy}</StyledTableCell>
                        <StyledTableCell>{formatDate(issue.createdAt)}</StyledTableCell>
                        <StyledTableCell>
                          {issue.resolvedAt ? formatDate(issue.resolvedAt) : '—'}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

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
              rowsPerPageOptions={APP_TABLE_CONFIG.ITEMS_PER_PAGE_OPTION}
              sx={paginationSx}
            />
          )}
        </>
      )}
    </Box>
  )
}

export default IssueReport
