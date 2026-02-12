import { ISSUE_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type {
  IssueFiltersDto,
  CreateIssuePayload,
  UpdateIssuePayload,
  IssueParams,
} from '../../utilities/models'

// Fetch issues list
const fetchIssues = (params?: { filters?: IssueFiltersDto }) => ({
  type: ISSUE_ACTION_TYPES.FETCH_ISSUES + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Fetch single issue
const fetchIssue = (params: IssueParams) => ({
  type: ISSUE_ACTION_TYPES.FETCH_ISSUE + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Create issue
const createIssue = (payload: CreateIssuePayload) => ({
  type: ISSUE_ACTION_TYPES.CREATE_ISSUE + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

// Update issue
const updateIssue = (payload: UpdateIssuePayload) => ({
  type: ISSUE_ACTION_TYPES.UPDATE_ISSUE + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

// Delete issue
const deleteIssue = (params: IssueParams) => ({
  type: ISSUE_ACTION_TYPES.DELETE_ISSUE + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Fetch status counts
const fetchStatusCounts = () => ({
  type: ISSUE_ACTION_TYPES.FETCH_STATUS_COUNTS + COMMON_ACTION_TYPES.REQUEST,
})

// Fetch metadata
const fetchMetadata = () => ({
  type: ISSUE_ACTION_TYPES.FETCH_METADATA + COMMON_ACTION_TYPES.REQUEST,
})

// Fetch my issues
const fetchMyIssues = (params?: { filters?: IssueFiltersDto }) => ({
  type: ISSUE_ACTION_TYPES.FETCH_MY_ISSUES + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// Fetch my status counts (user's own issues)
const fetchMyStatusCounts = () => ({
  type: ISSUE_ACTION_TYPES.FETCH_MY_STATUS_COUNTS + COMMON_ACTION_TYPES.REQUEST,
})

// Clear actions
const clearCurrentIssue = () => ({
  type: ISSUE_ACTION_TYPES.CLEAR_CURRENT_ISSUE,
})

export const issueActions = {
  fetchIssues,
  fetchIssue,
  createIssue,
  updateIssue,
  deleteIssue,
  fetchStatusCounts,
  fetchMetadata,
  fetchMyIssues,
  fetchMyStatusCounts,
  clearCurrentIssue,
}
