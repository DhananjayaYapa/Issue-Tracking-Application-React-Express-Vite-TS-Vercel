import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Alert } from '@mui/material'
import { issueActions, alertActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import type { ExportFiltersDto, User } from '../../utilities/models'
import { ReportFilters, ReportTable } from '../../components/report'
import {
  ISSUE_STATUS,
  ISSUE_PRIORITY,
  EXPORT_ACTION_TYPES,
  COMMON_ACTION_TYPES,
  ALERT_CONFIGS,
} from '../../utilities/constants'
import { issueService } from '../../services/issue.service'
import { userService } from '../../services/user.service'
import styles from './IssueReport.module.scss'

const INITIAL_FILTERS_STATE: ExportFiltersDto = {}

const IssueReport: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { fetchMetadata } = useSelector((state: RootState) => state.issues)
  const metadata = fetchMetadata.data
  const downloadReportAlert = useSelector((state: RootState) => state.alert.downloadReportAlert)

  const isAdmin = user?.role === 'admin'

  const [filters, setFilters] = useState(INITIAL_FILTERS_STATE)
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
    dispatch(issueActions.fetchMetadata())
    if (isAdmin) {
      userService.getUsers().then((res) => {
        setUsers(res.data.data || [])
      })
    }
    // Load all issues by default
    loadReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isAdmin])

  const statusOptions = (metadata?.statuses || Object.values(ISSUE_STATUS))
    .map((s) => ({
      value: s,
      label: s,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const priorityOptions = (metadata?.priorities || Object.values(ISSUE_PRIORITY))
    .map((p) => ({
      value: p,
      label: p,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const userOptions = users
    .map((u) => ({
      value: String(u.userId),
      label: u.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

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
    setFilters(INITIAL_FILTERS_STATE)
    setFromDate('')
    setToDate('')
    setReportData([])
    setViewed(false)
    setError(null)
    loadReport(INITIAL_FILTERS_STATE)
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

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value)
  }

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value)
  }

  const handleStatusFilterChange = (value: string) => {
    handleFilterChange('status', value)
  }

  const handlePriorityFilterChange = (value: string) => {
    handleFilterChange('priority', value)
  }

  const handleCreatedByFilterChange = (value: string) => {
    handleFilterChange('createdBy', value)
  }

  const handleClearDownloadReportAlert = () => {
    dispatch(alertActions.clearDownloadReportAlert())
  }

  const handleOpenDownloadMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleCloseDownloadMenu = () => {
    setAnchorEl(null)
  }

  const handleDownloadCsv = () => {
    handleDownload('csv')
  }

  const handleDownloadJson = () => {
    handleDownload('json')
  }

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  return (
    <Box className={styles.reportPage}>
      <ReportFilters
        fromDate={fromDate}
        toDate={toDate}
        statusValue={filters.status || ''}
        priorityValue={filters.priority || ''}
        createdByValue={filters.createdBy ? String(filters.createdBy) : ''}
        statusOptions={statusOptions}
        priorityOptions={priorityOptions}
        userOptions={userOptions}
        isAdmin={isAdmin}
        loading={loading}
        onFromDateChange={handleFromDateChange}
        onToDateChange={handleToDateChange}
        onStatusChange={handleStatusFilterChange}
        onPriorityChange={handlePriorityFilterChange}
        onCreatedByChange={handleCreatedByFilterChange}
        onViewReport={handleViewReport}
        onReset={handleReset}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {downloadReportAlert?.message && (
        <Alert
          severity={downloadReportAlert.severity ?? 'info'}
          onClose={handleClearDownloadReportAlert}
          sx={{ mb: 2 }}
        >
          {downloadReportAlert.message}
        </Alert>
      )}

      {viewed && !loading && (
        <ReportTable
          reportData={reportData}
          page={page}
          rowsPerPage={rowsPerPage}
          anchorEl={anchorEl}
          downloadMenuOpen={downloadMenuOpen}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onOpenDownloadMenu={handleOpenDownloadMenu}
          onCloseDownloadMenu={handleCloseDownloadMenu}
          onDownloadCsv={handleDownloadCsv}
          onDownloadJson={handleDownloadJson}
        />
      )}
    </Box>
  )
}

export default IssueReport
