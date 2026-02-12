import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Alert, TablePagination } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { issueActions, alertActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import type {
  Issue,
  IssueFiltersDto as IssueFiltersType,
  CreateIssuePayload,
  IssueFormData,
} from '../../utilities/models'
import { PageHeader, ConfirmationDialog } from '../../components/shared'
import {
  IssueTable,
  IssueFilters,
  IssueFormDialog,
  IssueDetailDialog,
} from '../../components/issues'
import styles from './MyIssues.module.scss'
import { validateFormData } from '../../utilities/helpers/formValidator'
import { APP_TABLE_CONFIG } from '../../utilities/constants'
import { paginationSx } from '../../assets/theme/theme'

const ISSUE_INITIAL_STATE: IssueFormData = {
  title: {
    value: '',
    validator: 'text',
    isRequired: true,
    minLength: 3,
    maxLength: 50,
    error: null,
  },
  description: {
    value: '',
    validator: 'text',
    isRequired: true,
    minLength: 3,
    maxLength: 225,
    error: null,
  },
  status: { value: 'Open', validator: 'text', isRequired: true, error: null },
  priority: { value: 'Medium', validator: 'text', isRequired: true, error: null },
}

const INITIAL_FILTERS_STATE: IssueFiltersType = {}

const MyIssues: React.FC = () => {
  const dispatch = useDispatch()

  const issueState = useSelector((state: RootState) => state.issues)
  const { data: issues, isLoading, error } = issueState.fetchMyIssues
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const isUserDisabled = currentUser?.isEnabled === false
  const createIssueAlert = useSelector((state: RootState) => state.alert.createIssueAlert)
  const updateIssueAlert = useSelector((state: RootState) => state.alert.updateIssueAlert)
  const deleteIssueAlert = useSelector((state: RootState) => state.alert.deleteIssueAlert)
  const [pendingFilters, setPendingFilters] = useState(INITIAL_FILTERS_STATE)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS_STATE)
  const [appliedFromDate, setAppliedFromDate] = useState('')
  const [appliedToDate, setAppliedToDate] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [currentIssue, setCurrentIssue] = useState<Issue | null>(null)
  const [issueFormData, setIssueFormData] = useState<IssueFormData>(ISSUE_INITIAL_STATE)
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteIssueId, setDeleteIssueId] = useState<number | null>(null)
  const [showStatusIcons, setShowStatusIcons] = useState(false)
  const [showPriorityIcons, setShowPriorityIcons] = useState(false)
  const [viewIssue, setViewIssue] = useState<Issue | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(0)

  useEffect(() => {
    dispatch(issueActions.fetchMyIssues())
    dispatch(issueActions.fetchMetadata())
  }, [dispatch])

  const filteredIssues = issues.filter((issue) => {
    let match = true
    if (appliedFilters.status && issue.status !== appliedFilters.status) match = false
    if (appliedFilters.priority && issue.priority !== appliedFilters.priority) match = false
    if (appliedFromDate) {
      const issueDate = new Date(issue.createdAt)
      if (issueDate < new Date(appliedFromDate)) match = false
    }
    if (appliedToDate) {
      const issueDate = new Date(issue.createdAt)
      const end = new Date(appliedToDate)
      end.setHours(23, 59, 59, 999)
      if (issueDate > end) match = false
    }
    // Search filter
    if (searchInput.trim()) {
      const searchTerm = searchInput.trim().toLowerCase()
      const searchMatch =
        issue.title.toLowerCase().includes(searchTerm) ||
        issue.description?.toLowerCase().includes(searchTerm) ||
        issue.status.toLowerCase().includes(searchTerm) ||
        issue.priority.toLowerCase().includes(searchTerm) ||
        issue.createdBy.name.toLowerCase().includes(searchTerm)
      if (!searchMatch) match = false
    }
    return match
  })

  const paginatedData = filteredIssues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const handleApplyFilters = () => {
    setAppliedFilters({ ...pendingFilters })
    setAppliedFromDate(fromDate)
    setAppliedToDate(toDate)
  }

  const handleResetFilters = () => {
    setPendingFilters(INITIAL_FILTERS_STATE)
    setFromDate('')
    setToDate('')
    setAppliedFilters(INITIAL_FILTERS_STATE)
    setAppliedFromDate('')
    setAppliedToDate('')
    setSearchInput('')
  }

  const handleFilterChange = (key: keyof IssueFiltersType, value: string) => {
    setPendingFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }))
  }

  const handleOpenCreate = () => {
    setCurrentIssue(null)
    setIssueFormData(ISSUE_INITIAL_STATE)
    setAttachmentFile(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (issue: Issue) => {
    setCurrentIssue(issue)
    setIssueFormData({
      title: { ...ISSUE_INITIAL_STATE.title, value: issue.title },
      description: { ...ISSUE_INITIAL_STATE.description, value: issue.description || '' },
      status: { ...ISSUE_INITIAL_STATE.status, value: issue.status },
      priority: { ...ISSUE_INITIAL_STATE.priority, value: issue.priority },
    })
    setAttachmentFile(null)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setCurrentIssue(null)
    setIssueFormData(ISSUE_INITIAL_STATE)
    setAttachmentFile(null)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormChange = (property: string, value: any) => {
    setIssueFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property as keyof typeof prev],
        value: value,
        error: null,
      },
    }))
  }

  const handleSaveIssue = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [validatedData, isValid]: [any, boolean] = await validateFormData(issueFormData)
    setIssueFormData(validatedData)

    if (!isValid) return

    const payload: CreateIssuePayload = {
      title: validatedData.title.value,
      description: validatedData.description.value,
      priority: validatedData.priority.value,
      attachment: attachmentFile,
    }

    if (currentIssue) {
      dispatch(
        issueActions.updateIssue({
          id: currentIssue.id,
          ...payload,
        })
      )
    } else {
      dispatch(issueActions.createIssue(payload))
    }
    setTimeout(() => {
      dispatch(issueActions.fetchMyIssues())
    }, 500)

    handleCloseForm()
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
        dispatch(issueActions.fetchMyIssues())
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

  const handleClearCreateIssueAlert = () => {
    dispatch(alertActions.clearCreateIssueAlert())
  }

  const handleClearUpdateIssueAlert = () => {
    dispatch(alertActions.clearUpdateIssueAlert())
  }

  const handleClearDeleteIssueAlert = () => {
    dispatch(alertActions.clearDeleteIssueAlert())
  }

  return (
    <Box className={styles.myIssuesPage}>
      <PageHeader
        actionLabel="New Issue"
        actionIcon={<AddIcon />}
        onAction={handleOpenCreate}
        actionDisabled={isUserDisabled}
      />

      {isUserDisabled && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Your account has been disabled. You cannot create, edit, or delete issues.
        </Alert>
      )}

      {createIssueAlert?.message && (
        <Alert
          severity={createIssueAlert.severity ?? 'info'}
          sx={{ mb: 2 }}
          onClose={handleClearCreateIssueAlert}
        >
          {createIssueAlert.message}
        </Alert>
      )}

      {updateIssueAlert?.message && (
        <Alert
          severity={updateIssueAlert.severity ?? 'info'}
          sx={{ mb: 2 }}
          onClose={handleClearUpdateIssueAlert}
        >
          {updateIssueAlert.message}
        </Alert>
      )}

      {deleteIssueAlert?.message && (
        <Alert
          severity={deleteIssueAlert.severity ?? 'info'}
          sx={{ mb: 2 }}
          onClose={handleClearDeleteIssueAlert}
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
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onView={handleViewIssue}
        showStatusIcons={showStatusIcons}
        showPriorityIcons={showPriorityIcons}
        onToggleStatusIcons={handleToggleStatusIcons}
        onTogglePriorityIcons={handleTogglePriorityIcons}
        disableEditDelete={isUserDisabled}
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

      <IssueFormDialog
        open={formOpen}
        onClose={handleCloseForm}
        isEditing={!!currentIssue}
        formData={issueFormData}
        onChange={handleFormChange}
        onSave={handleSaveIssue}
        loading={isLoading}
        hideStatus
        attachment={attachmentFile}
        onAttachmentChange={setAttachmentFile}
        existingAttachment={currentIssue?.attachment}
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

      <IssueDetailDialog open={!!viewIssue} onClose={handleCloseViewDialog} issue={viewIssue} />
    </Box>
  )
}

export default MyIssues
