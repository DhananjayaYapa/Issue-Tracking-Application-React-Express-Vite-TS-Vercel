import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Alert } from '@mui/material'
import { issueActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import type {
  Issue,
  IssueFiltersDto as IssueFiltersType,
  IssueStatus,
  User,
} from '../../utilities/models'
import { PageHeader, ConfirmationDialog } from '../../components/shared'
import { IssueTable, IssueFilters, IssueDetailDialog } from '../../components/issues'
import { userService } from '../../services/user.service'
import styles from './Issues.module.scss'

const Issues: React.FC = () => {
  const dispatch = useDispatch()

  const { issues, isLoading, error } = useSelector((state: RootState) => state.issues)

  const [filters, setFilters] = useState<IssueFiltersType>({})
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [createdByValue, setCreatedByValue] = useState('')
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

  useEffect(() => {
    dispatch(issueActions.fetchIssuesRequest(filters))
    dispatch(issueActions.fetchMetadataRequest())
    userService.getUsers().then((res) => {
      setUsers(res.data.data || [])
    })
  }, [dispatch, filters])

  const userOptions = users.map((u) => ({
    value: String(u.userId),
    label: u.name,
  }))

  const handleApplyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      createdBy: createdByValue ? Number(createdByValue) : undefined,
    }))
  }

  const handleFilterChange = (key: keyof IssueFiltersType, value: string) => {
    setFilters((prev) => ({
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
        dispatch(issueActions.fetchIssuesRequest(filters))
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
        dispatch(issueActions.fetchIssuesRequest(filters))
      }, 500)
    }
    handleCloseDelete()
  }

  return (
    <Box className={styles.issuesPage}>
      <PageHeader title="Issues" />

      <IssueFilters
        filters={filters}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        loading={isLoading}
        showStatusIcons={showStatusIcons}
        showPriorityIcons={showPriorityIcons}
        onToggleStatusIcons={() => setShowStatusIcons(!showStatusIcons)}
        onTogglePriorityIcons={() => setShowPriorityIcons(!showPriorityIcons)}
        showCreatedBy
        userOptions={userOptions}
        createdByValue={createdByValue}
        onCreatedByChange={setCreatedByValue}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <IssueTable
        issues={issues}
        loading={isLoading}
        onEdit={() => {}}
        onDelete={handleOpenDelete}
        onView={(issue) => setViewIssue(issue)}
        onComment={() => {}}
        onStatusChange={handleStatusChange}
        editingStatusId={editingStatusId}
        onEditStatusToggle={handleEditStatusToggle}
        showActions={true}
        showStatusIcons={showStatusIcons}
        showPriorityIcons={showPriorityIcons}
      />

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
