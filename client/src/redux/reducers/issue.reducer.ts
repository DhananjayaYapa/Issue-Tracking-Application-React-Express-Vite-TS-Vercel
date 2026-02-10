import { ISSUE_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type { Issue, StatusCountsDto, IssueMetadataDto } from '../../utilities/models'

export interface IssueState {
  issues: Issue[]
  currentIssue: Issue | null
  statusCounts: StatusCountsDto | null
  myStatusCounts: StatusCountsDto | null
  metadata: IssueMetadataDto | null
  isLoading: boolean
  error: string | null
}

const INITIAL_STATE: IssueState = {
  issues: [],
  currentIssue: null,
  statusCounts: null,
  myStatusCounts: null,
  metadata: null,
  isLoading: false,
  error: null,
}

// Issue Reducer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const issueReducer = (state = INITIAL_STATE, action: any): IssueState => {
  switch (action.type) {
    // Fetch Issues List
    case ISSUE_ACTION_TYPES.FETCH_ISSUES + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case ISSUE_ACTION_TYPES.FETCH_ISSUES + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        issues: action.data,
        error: null,
      }
    case ISSUE_ACTION_TYPES.FETCH_ISSUES + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Fetch Single Issue
    case ISSUE_ACTION_TYPES.FETCH_ISSUE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case ISSUE_ACTION_TYPES.FETCH_ISSUE + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentIssue: action.data,
        error: null,
      }
    case ISSUE_ACTION_TYPES.FETCH_ISSUE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Create Issue
    case ISSUE_ACTION_TYPES.CREATE_ISSUE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case ISSUE_ACTION_TYPES.CREATE_ISSUE + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        issues: [action.data, ...state.issues],
        error: null,
      }
    case ISSUE_ACTION_TYPES.CREATE_ISSUE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Update Issue
    case ISSUE_ACTION_TYPES.UPDATE_ISSUE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case ISSUE_ACTION_TYPES.UPDATE_ISSUE + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        issues: state.issues.map((issue) => (issue.id === action.data.id ? action.data : issue)),
        currentIssue: state.currentIssue?.id === action.data.id ? action.data : state.currentIssue,
        error: null,
      }
    case ISSUE_ACTION_TYPES.UPDATE_ISSUE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Delete Issue
    case ISSUE_ACTION_TYPES.DELETE_ISSUE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case ISSUE_ACTION_TYPES.DELETE_ISSUE + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        issues: state.issues.filter((issue) => issue.id !== action.data),
        error: null,
      }
    case ISSUE_ACTION_TYPES.DELETE_ISSUE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Fetch Status Counts
    case ISSUE_ACTION_TYPES.FETCH_STATUS_COUNTS + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case ISSUE_ACTION_TYPES.FETCH_STATUS_COUNTS + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        statusCounts: action.data,
        error: null,
      }
    case ISSUE_ACTION_TYPES.FETCH_STATUS_COUNTS + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Fetch Metadata
    case ISSUE_ACTION_TYPES.FETCH_METADATA + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        error: null,
      }
    case ISSUE_ACTION_TYPES.FETCH_METADATA + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        metadata: action.data,
        error: null,
      }
    case ISSUE_ACTION_TYPES.FETCH_METADATA + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        error: action.error,
      }
    case ISSUE_ACTION_TYPES.FETCH_MY_ISSUES + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case ISSUE_ACTION_TYPES.FETCH_MY_ISSUES + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        issues: action.data,
        error: null,
      }
    case ISSUE_ACTION_TYPES.FETCH_MY_ISSUES + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      }

    // Clear Current Issue
    case ISSUE_ACTION_TYPES.CLEAR_CURRENT_ISSUE:
      return {
        ...state,
        currentIssue: null,
      }

    // Fetch My Status Counts
    case ISSUE_ACTION_TYPES.FETCH_MY_STATUS_COUNTS + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        error: null,
      }
    case ISSUE_ACTION_TYPES.FETCH_MY_STATUS_COUNTS + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        myStatusCounts: action.data,
        error: null,
      }
    case ISSUE_ACTION_TYPES.FETCH_MY_STATUS_COUNTS + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        error: action.error,
      }

    // Clear Error
    case ISSUE_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

export default issueReducer
