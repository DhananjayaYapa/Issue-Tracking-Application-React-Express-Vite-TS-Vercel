import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Alert, TablePagination } from '@mui/material'
import { issueActions, alertActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import type {
  Issue,
  IssueFiltersDto as IssueFiltersType,
  IssueStatus,
  User,
} from '../../utilities/models'
import { ConfirmationDialog } from '../../components/shared'
import { IssueTable, IssueFilters, IssueDetailDialog } from '../../components/issues'
import { userService } from '../../services/user.service'
import styles from './Issues.module.scss'
import { APP_TABLE_CONFIG } from '../../utilities/constants'
import { paginationSx } from '../../assets/theme/theme'

const INITIAL_STATUS_CHANGE_STATE: { issueId: number; status: IssueStatus } | null = null
const INITIAL_FILTERS_STATE: IssueFiltersType = {}

const Issues: React.FC = () => {
  const dispatch = useDispatch()

  const issueState = useSelector((state: RootState) => state.issues)
  const { data: issues, isLoading, error } = issueState.fetchIssues
  const updateIssueAlert = useSelector((state: RootState) => state.alert.updateIssueAlert)
  const deleteIssueAlert = useSelector((state: RootState) => state.alert.deleteIssueAlert)

  const [pendingFilters, setPendingFilters] = useState(INITIAL_FILTERS_STATE)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [createdByValue, setCreatedByValue] = useState('')
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS_STATE)
  const [users, setUsers] = useState<User[]>([])
  const [editingStatusId, setEditingStatusId] = useState<number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteIssueId, setDeleteIssueId] = useState<number | null>(null)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    issueId: number
    status: IssueStatus
  } | null>(INITIAL_STATUS_CHANGE_STATE)
  const [showStatusIcons, setShowStatusIcons] = useState(false)
  const [showPriorityIcons, setShowPriorityIcons] = useState(false)
  const [viewIssue, setViewIssue] = useState<Issue | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(0)

  // search
  const filteredIssues = issues.filter((issue) => {
    if (!searchInput.trim()) return true
    const searchTerm = searchInput.trim().toLowerCase()
    return (
      issue.title.toLowerCase().includes(searchTerm) ||
      issue.description?.toLowerCase().includes(searchTerm) ||
      issue.status.toLowerCase().includes(searchTerm) ||
      issue.priority.toLowerCase().includes(searchTerm) ||
      issue.createdBy.name.toLowerCase().includes(searchTerm)
    )
  })

  const paginatedData = filteredIssues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  useEffect(() => {
    dispatch(issueActions.fetchIssues({ filters: appliedFilters }))
    dispatch(issueActions.fetchMetadata())
    userService.getUsers().then((res) => {
      setUsers(res.data.data || [])
    })
  }, [dispatch, appliedFilters])

  const userOptions = users
    .map((u) => ({
      value: String(u.userId),
      label: u.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const handleApplyFilters = () => {
    setAppliedFilters({
      ...pendingFilters,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      createdBy: createdByValue ? Number(createdByValue) : undefined,
    })
  }

  const handleResetFilters = () => {
    setPendingFilters(INITIAL_FILTERS_STATE)
    setFromDate('')
    setToDate('')
    setCreatedByValue('')
    setAppliedFilters(INITIAL_FILTERS_STATE)
    setSearchInput('')
  }

  const handleFilterChange = (key: keyof IssueFiltersType, value: string) => {
    setPendingFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }))
  }

  const handleEditStatusToggle = (issueId: number | null) => {
    setEditingStatusId(issueId)
  }

  const handleStatusChange = (issueId: number, status: IssueStatus) => {
    setPendingStatusChange({ issueId, status })
    setStatusDialogOpen(true)
  }

  const handleConfirmStatusChange = () => {
    if (pendingStatusChange) {
      dispatch(
        issueActions.updateIssue({
          id: pendingStatusChange.issueId,
          status: pendingStatusChange.status,
        })
      )
      setEditingStatusId(null)
      setTimeout(() => {
        dispatch(issueActions.fetchIssues({ filters: appliedFilters }))
      }, 500)
    }
    setStatusDialogOpen(false)
    setPendingStatusChange(INITIAL_STATUS_CHANGE_STATE)
  }

  const handleCancelStatusChange = () => {
    setStatusDialogOpen(false)
    setPendingStatusChange(INITIAL_STATUS_CHANGE_STATE)
  }

  const handleOpenDelete = (id: number) => {
    setDeleteIssueId(id)
    setDeleteDialogOpen(true)
  }

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false)
    setDeleteIssueId(null)
  }

  const handleConfirmDelete = () => {
    if (deleteIssueId) {
      dispatch(issueActions.deleteIssue({ id: deleteIssueId }))
      setTimeout(() => {
        dispatch(issueActions.fetchIssues({ filters: appliedFilters }))
      }, 500)
    }
    handleCloseDelete()
  }

  const handleViewIssue = (issue: Issue) => {
    setViewIssue(issue)
  }

  const handleCloseViewDialog = () => {
    setViewIssue(null)
  }

  const handleToggleStatusIcons = () => {
    setShowStatusIcons(!showStatusIcons)
  }

  const handleTogglePriorityIcons = () => {
    setShowPriorityIcons(!showPriorityIcons)
  }

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  const handleClearUpdateIssueAlert = () => {
    dispatch(alertActions.clearUpdateIssueAlert())
  }

  const handleClearDeleteIssueAlert = () => {
    dispatch(alertActions.clearDeleteIssueAlert())
  }

  return (
    <Box className={styles.issuesPage}>
      {updateIssueAlert?.message && (
        <Alert
          severity={updateIssueAlert.severity ?? 'info'}
          onClose={handleClearUpdateIssueAlert}
          sx={{ mb: 2 }}
        >
          {updateIssueAlert.message}
        </Alert>
      )}

      {deleteIssueAlert?.message && (
        <Alert
          severity={deleteIssueAlert.severity ?? 'info'}
          onClose={handleClearDeleteIssueAlert}
          sx={{ mb: 2 }}
        >
          {deleteIssueAlert.message}
        </Alert>
      )}

      <IssueFilters
        filters={pendingFilters}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        loading={isLoading}
        showCreatedBy
        userOptions={userOptions}
        createdByValue={createdByValue}
        onCreatedByChange={setCreatedByValue}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <IssueTable
        issues={paginatedData}
        loading={isLoading}
        onEdit={() => {}}
        onDelete={handleOpenDelete}
        onView={handleViewIssue}
        onStatusChange={handleStatusChange}
        editingStatusId={editingStatusId}
        onEditStatusToggle={handleEditStatusToggle}
        showActions={true}
        showStatusIcons={showStatusIcons}
        showPriorityIcons={showPriorityIcons}
        onToggleStatusIcons={handleToggleStatusIcons}
        onTogglePriorityIcons={handleTogglePriorityIcons}
      >
        {filteredIssues.length > 0 && (
          <TablePagination
            component="div"
            count={filteredIssues.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={APP_TABLE_CONFIG.ITEMS_PER_PAGE_OPTION}
            sx={paginationSx}
          />
        )}
      </IssueTable>

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Issue"
        message="Are you sure you want to delete this issue? This action cannot be undone."
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDelete}
      />

      <ConfirmationDialog
        open={statusDialogOpen}
        title="Change Status"
        message={`Are you sure you want to change the status to "${pendingStatusChange?.status}"?`}
        confirmLabel="Confirm"
        confirmColor="primary"
        onConfirm={handleConfirmStatusChange}
        onCancel={handleCancelStatusChange}
      />

      <IssueDetailDialog open={!!viewIssue} onClose={handleCloseViewDialog} issue={viewIssue} />
    </Box>
  )
}

export default Issues
