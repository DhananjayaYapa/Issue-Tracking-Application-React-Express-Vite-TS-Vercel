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

const Issues: React.FC = () => {
  const dispatch = useDispatch()

  const { issues, isLoading, error } = useSelector((state: RootState) => state.issues)
  const updateIssueAlert = useSelector((state: RootState) => state.alert.updateIssueAlert)
  const deleteIssueAlert = useSelector((state: RootState) => state.alert.deleteIssueAlert)

  // Pending filters (what user selects before clicking Apply)
  const [pendingFilters, setPendingFilters] = useState<IssueFiltersType>({})
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [createdByValue, setCreatedByValue] = useState('')

  // Applied filters (what triggers API call)
  const [appliedFilters, setAppliedFilters] = useState<IssueFiltersType>({})
  const [users, setUsers] = useState<User[]>([])

  const [editingStatusId, setEditingStatusId] = useState<number | null>(null)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteIssueId, setDeleteIssueId] = useState<number | null>(null)

  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    issueId: number
    status: IssueStatus
  } | null>(null)

  const [showStatusIcons, setShowStatusIcons] = useState(false)
  const [showPriorityIcons, setShowPriorityIcons] = useState(false)

  const [viewIssue, setViewIssue] = useState<Issue | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(0)

  // Filter issues based on search input
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
    dispatch(issueActions.fetchIssuesRequest(appliedFilters))
    dispatch(issueActions.fetchMetadataRequest())
    userService.getUsers().then((res) => {
      setUsers(res.data.data || [])
    })
  }, [dispatch, appliedFilters])

  const userOptions = users.map((u) => ({
    value: String(u.userId),
    label: u.name,
  }))

  const handleApplyFilters = () => {
    setAppliedFilters({
      ...pendingFilters,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      createdBy: createdByValue ? Number(createdByValue) : undefined,
    })
  }

  const handleResetFilters = () => {
    setPendingFilters({})
    setFromDate('')
    setToDate('')
    setCreatedByValue('')
    setAppliedFilters({})
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
        issueActions.updateIssueRequest({
          id: pendingStatusChange.issueId,
          status: pendingStatusChange.status,
        })
      )
      setEditingStatusId(null)
      setTimeout(() => {
        dispatch(issueActions.fetchIssuesRequest(appliedFilters))
      }, 500)
    }
    setStatusDialogOpen(false)
    setPendingStatusChange(null)
  }

  const handleCancelStatusChange = () => {
    setStatusDialogOpen(false)
    setPendingStatusChange(null)
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
      dispatch(issueActions.deleteIssueRequest(deleteIssueId))
      setTimeout(() => {
        dispatch(issueActions.fetchIssuesRequest(appliedFilters))
      }, 500)
    }
    handleCloseDelete()
  }

  return (
    <Box className={styles.issuesPage}>
      {updateIssueAlert?.message && (
        <Alert
          severity={updateIssueAlert.severity ?? 'info'}
          onClose={() => dispatch(alertActions.clearUpdateIssueAlert())}
          sx={{ mb: 2 }}
        >
          {updateIssueAlert.message}
        </Alert>
      )}

      {deleteIssueAlert?.message && (
        <Alert
          severity={deleteIssueAlert.severity ?? 'info'}
          onClose={() => dispatch(alertActions.clearDeleteIssueAlert())}
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
        onView={(issue) => setViewIssue(issue)}
        onStatusChange={handleStatusChange}
        editingStatusId={editingStatusId}
        onEditStatusToggle={handleEditStatusToggle}
        showActions={true}
        showStatusIcons={showStatusIcons}
        showPriorityIcons={showPriorityIcons}
        onToggleStatusIcons={() => setShowStatusIcons(!showStatusIcons)}
        onTogglePriorityIcons={() => setShowPriorityIcons(!showPriorityIcons)}
      >
        {filteredIssues.length > 0 && (
          <TablePagination
            component="div"
            count={filteredIssues.length}
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

      <IssueDetailDialog open={!!viewIssue} onClose={() => setViewIssue(null)} issue={viewIssue} />
    </Box>
  )
}

export default Issues
