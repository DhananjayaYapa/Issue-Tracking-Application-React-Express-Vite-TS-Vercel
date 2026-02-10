import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Alert } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { issueActions } from '../../redux/actions'
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

const MyIssues: React.FC = () => {
  const dispatch = useDispatch()

  const { issues, isLoading, error } = useSelector((state: RootState) => state.issues)
  const [filters, setFilters] = useState<IssueFiltersType>({})
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [currentIssue, setCurrentIssue] = useState<Issue | null>(null)
  const [issueFormData, setIssueFormData] = useState<IssueFormData>(ISSUE_INITIAL_STATE)
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteIssueId, setDeleteIssueId] = useState<number | null>(null)
  const [showStatusIcons, setShowStatusIcons] = useState(false)
  const [showPriorityIcons, setShowPriorityIcons] = useState(false)
  const [viewIssue, setViewIssue] = useState<Issue | null>(null)

  useEffect(() => {
    dispatch(issueActions.fetchMyIssuesRequest())
    dispatch(issueActions.fetchMetadataRequest())
  }, [dispatch])

  const filteredIssues = issues.filter((issue) => {
    let match = true
    if (filters.status && issue.status !== filters.status) match = false
    if (filters.priority && issue.priority !== filters.priority) match = false
    if (fromDate) {
      const issueDate = new Date(issue.createdAt)
      if (issueDate < new Date(fromDate)) match = false
    }
    if (toDate) {
      const issueDate = new Date(issue.createdAt)
      const end = new Date(toDate)
      end.setHours(23, 59, 59, 999)
      if (issueDate > end) match = false
    }
    return match
  })

  const handleApplyFilters = () => {
    setFilters((prev) => ({ ...prev }))
  }

  const handleFilterChange = (key: keyof IssueFiltersType, value: string) => {
    setFilters((prev) => ({
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
    setIssueFormData({
      ...issueFormData,
      [property]: {
        ...issueFormData[property as keyof typeof issueFormData],
        value: value,
        error: null,
      },
    })
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
        issueActions.updateIssueRequest({
          id: currentIssue.id,
          ...payload,
        })
      )
    } else {
      dispatch(issueActions.createIssueRequest(payload))
    }
    setTimeout(() => {
      dispatch(issueActions.fetchMyIssuesRequest())
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
      dispatch(issueActions.deleteIssueRequest(deleteIssueId))
      setTimeout(() => {
        dispatch(issueActions.fetchMyIssuesRequest())
      }, 500)
    }
    handleCloseDelete()
  }

  return (
    <Box className={styles.myIssuesPage}>
      <PageHeader
        title="My Issues"
        actionLabel="New Issue"
        actionIcon={<AddIcon />}
        onAction={handleOpenCreate}
      />

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
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <IssueTable
        issues={filteredIssues}
        loading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onView={(issue) => setViewIssue(issue)}
        showStatusIcons={showStatusIcons}
        showPriorityIcons={showPriorityIcons}
      />

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

      <IssueDetailDialog open={!!viewIssue} onClose={() => setViewIssue(null)} issue={viewIssue} />
    </Box>
  )
}

export default MyIssues
