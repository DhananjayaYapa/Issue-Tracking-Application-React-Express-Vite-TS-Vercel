import { ISSUE_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type {
  IssueFiltersDto,
  CreateIssuePayload,
  UpdateIssuePayload,
  Issue,
  StatusCountsDto,
  IssueMetadataDto,
} from '../../utilities/models'

// Fetch issues list
const fetchIssuesRequest = (filters: IssueFiltersDto) => ({
  type: ISSUE_ACTION_TYPES.FETCH_ISSUES + COMMON_ACTION_TYPES.REQUEST,
  payload: filters,
})

const fetchIssuesSuccess = (data: Issue[]) => ({
  type: ISSUE_ACTION_TYPES.FETCH_ISSUES + COMMON_ACTION_TYPES.SUCCESS,
  data,
})

const fetchIssuesError = (error: string) => ({
  type: ISSUE_ACTION_TYPES.FETCH_ISSUES + COMMON_ACTION_TYPES.ERROR,
  error,
})

// Fetch single issue
const fetchIssueRequest = (id: number) => ({
  type: ISSUE_ACTION_TYPES.FETCH_ISSUE + COMMON_ACTION_TYPES.REQUEST,
  payload: id,
})

const fetchIssueSuccess = (data: Issue) => ({
  type: ISSUE_ACTION_TYPES.FETCH_ISSUE + COMMON_ACTION_TYPES.SUCCESS,
  data,
})

const fetchIssueError = (error: string) => ({
  type: ISSUE_ACTION_TYPES.FETCH_ISSUE + COMMON_ACTION_TYPES.ERROR,
  error,
})

// Create issue
const createIssueRequest = (payload: CreateIssuePayload) => ({
  type: ISSUE_ACTION_TYPES.CREATE_ISSUE + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

const createIssueSuccess = (data: Issue) => ({
  type: ISSUE_ACTION_TYPES.CREATE_ISSUE + COMMON_ACTION_TYPES.SUCCESS,
  data,
})

const createIssueError = (error: string) => ({
  type: ISSUE_ACTION_TYPES.CREATE_ISSUE + COMMON_ACTION_TYPES.ERROR,
  error,
})

// Update issue
const updateIssueRequest = (payload: UpdateIssuePayload) => ({
  type: ISSUE_ACTION_TYPES.UPDATE_ISSUE + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

const updateIssueSuccess = (data: Issue) => ({
  type: ISSUE_ACTION_TYPES.UPDATE_ISSUE + COMMON_ACTION_TYPES.SUCCESS,
  data,
})

const updateIssueError = (error: string) => ({
  type: ISSUE_ACTION_TYPES.UPDATE_ISSUE + COMMON_ACTION_TYPES.ERROR,
  error,
})

// Delete issue
const deleteIssueRequest = (id: number) => ({
  type: ISSUE_ACTION_TYPES.DELETE_ISSUE + COMMON_ACTION_TYPES.REQUEST,
  payload: id,
})

const deleteIssueSuccess = (id: number) => ({
  type: ISSUE_ACTION_TYPES.DELETE_ISSUE + COMMON_ACTION_TYPES.SUCCESS,
  data: id,
})

const deleteIssueError = (error: string) => ({
  type: ISSUE_ACTION_TYPES.DELETE_ISSUE + COMMON_ACTION_TYPES.ERROR,
  error,
})

// Fetch status counts
const fetchStatusCountsRequest = () => ({
  type: ISSUE_ACTION_TYPES.FETCH_STATUS_COUNTS + COMMON_ACTION_TYPES.REQUEST,
})

const fetchStatusCountsSuccess = (data: StatusCountsDto) => ({
  type: ISSUE_ACTION_TYPES.FETCH_STATUS_COUNTS + COMMON_ACTION_TYPES.SUCCESS,
  data,
})

const fetchStatusCountsError = (error: string) => ({
  type: ISSUE_ACTION_TYPES.FETCH_STATUS_COUNTS + COMMON_ACTION_TYPES.ERROR,
  error,
})

// Fetch metadata
const fetchMetadataRequest = () => ({
  type: ISSUE_ACTION_TYPES.FETCH_METADATA + COMMON_ACTION_TYPES.REQUEST,
})

const fetchMetadataSuccess = (data: IssueMetadataDto) => ({
  type: ISSUE_ACTION_TYPES.FETCH_METADATA + COMMON_ACTION_TYPES.SUCCESS,
  data,
})

const fetchMetadataError = (error: string) => ({
  type: ISSUE_ACTION_TYPES.FETCH_METADATA + COMMON_ACTION_TYPES.ERROR,
  error,
})

// Fetch my issues
export const fetchMyIssuesRequest = (params?: IssueFiltersDto) => ({
  type: ISSUE_ACTION_TYPES.FETCH_MY_ISSUES + COMMON_ACTION_TYPES.REQUEST,
  params,
})

export const fetchMyIssuesSuccess = (data: Issue[]) => ({
  type: ISSUE_ACTION_TYPES.FETCH_MY_ISSUES + COMMON_ACTION_TYPES.SUCCESS,
  data,
})

export const fetchMyIssuesError = (error: string) => ({
  type: ISSUE_ACTION_TYPES.FETCH_MY_ISSUES + COMMON_ACTION_TYPES.ERROR,
  error,
})

// Fetch my status counts (user's own issues)
const fetchMyStatusCountsRequest = () => ({
  type: ISSUE_ACTION_TYPES.FETCH_MY_STATUS_COUNTS + COMMON_ACTION_TYPES.REQUEST,
})

const fetchMyStatusCountsSuccess = (data: StatusCountsDto) => ({
  type: ISSUE_ACTION_TYPES.FETCH_MY_STATUS_COUNTS + COMMON_ACTION_TYPES.SUCCESS,
  data,
})

const fetchMyStatusCountsError = (error: string) => ({
  type: ISSUE_ACTION_TYPES.FETCH_MY_STATUS_COUNTS + COMMON_ACTION_TYPES.ERROR,
  error,
})

// Clear actions
const clearCurrentIssue = () => ({
  type: ISSUE_ACTION_TYPES.CLEAR_CURRENT_ISSUE,
})

const clearError = () => ({
  type: ISSUE_ACTION_TYPES.CLEAR_ERROR,
})

export const issueActions = {
  fetchIssuesRequest,
  fetchIssuesSuccess,
  fetchIssuesError,
  fetchIssueRequest,
  fetchIssueSuccess,
  fetchIssueError,
  createIssueRequest,
  createIssueSuccess,
  createIssueError,
  updateIssueRequest,
  updateIssueSuccess,
  updateIssueError,
  deleteIssueRequest,
  deleteIssueSuccess,
  deleteIssueError,
  fetchStatusCountsRequest,
  fetchStatusCountsSuccess,
  fetchStatusCountsError,
  fetchMetadataRequest,
  fetchMetadataSuccess,
  fetchMetadataError,
  fetchMyIssuesRequest,
  fetchMyIssuesSuccess,
  fetchMyIssuesError,
  fetchMyStatusCountsRequest,
  fetchMyStatusCountsSuccess,
  fetchMyStatusCountsError,
  clearCurrentIssue,
  clearError,
}
