import { ISSUE_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type { Issue, StatusCountsDto, IssueMetadataDto } from '../../utilities/models'

// Nested state structure matching admin-react-poc pattern
interface ActionState<T> {
  isLoading: boolean
  data: T
  error: string | null
}

export interface IssueState {
  fetchIssues: ActionState<Issue[]>
  fetchIssue: ActionState<Issue | null>
  createIssue: ActionState<Issue | null>
  updateIssue: ActionState<Issue | null>
  deleteIssue: ActionState<unknown>
  fetchStatusCounts: ActionState<StatusCountsDto | null>
  fetchMyStatusCounts: ActionState<StatusCountsDto | null>
  fetchMetadata: ActionState<IssueMetadataDto | null>
  fetchMyIssues: ActionState<Issue[]>
}

const INITIAL_STATE: IssueState = {
  fetchIssues: { isLoading: false, data: [], error: null },
  fetchIssue: { isLoading: false, data: null, error: null },
  createIssue: { isLoading: false, data: null, error: null },
  updateIssue: { isLoading: false, data: null, error: null },
  deleteIssue: { isLoading: false, data: null, error: null },
  fetchStatusCounts: { isLoading: false, data: null, error: null },
  fetchMyStatusCounts: { isLoading: false, data: null, error: null },
  fetchMetadata: { isLoading: false, data: null, error: null },
  fetchMyIssues: { isLoading: false, data: [], error: null },
}

// Issue Reducer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const issueReducer = (state = INITIAL_STATE, action: any): IssueState => {
  switch (action.type) {
    // Fetch Issues List
    case ISSUE_ACTION_TYPES.FETCH_ISSUES + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        fetchIssues: { ...state.fetchIssues, isLoading: true, error: null },
      }
    case ISSUE_ACTION_TYPES.FETCH_ISSUES + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        fetchIssues: { isLoading: false, data: action.data, error: null },
      }
    case ISSUE_ACTION_TYPES.FETCH_ISSUES + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        fetchIssues: { ...state.fetchIssues, isLoading: false, error: action.error },
      }

    // Fetch Single Issue
    case ISSUE_ACTION_TYPES.FETCH_ISSUE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        fetchIssue: { ...state.fetchIssue, isLoading: true, error: null },
      }
    case ISSUE_ACTION_TYPES.FETCH_ISSUE + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        fetchIssue: { isLoading: false, data: action.data, error: null },
      }
    case ISSUE_ACTION_TYPES.FETCH_ISSUE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        fetchIssue: { ...state.fetchIssue, isLoading: false, error: action.error },
      }

    // Create Issue
    case ISSUE_ACTION_TYPES.CREATE_ISSUE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        createIssue: { ...state.createIssue, isLoading: true, error: null },
      }
    case ISSUE_ACTION_TYPES.CREATE_ISSUE + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        createIssue: { isLoading: false, data: action.data, error: null },
        fetchIssues: {
          ...state.fetchIssues,
          data: [action.data, ...state.fetchIssues.data],
        },
      }
    case ISSUE_ACTION_TYPES.CREATE_ISSUE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        createIssue: { ...state.createIssue, isLoading: false, error: action.error },
      }

    // Update Issue
    case ISSUE_ACTION_TYPES.UPDATE_ISSUE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        updateIssue: { ...state.updateIssue, isLoading: true, error: null },
      }
    case ISSUE_ACTION_TYPES.UPDATE_ISSUE + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        updateIssue: { isLoading: false, data: action.data, error: null },
        fetchIssues: {
          ...state.fetchIssues,
          data: state.fetchIssues.data.map((issue) =>
            issue.id === action.data.id ? action.data : issue
          ),
        },
        fetchIssue: {
          ...state.fetchIssue,
          data: state.fetchIssue.data?.id === action.data.id ? action.data : state.fetchIssue.data,
        },
      }
    case ISSUE_ACTION_TYPES.UPDATE_ISSUE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        updateIssue: { ...state.updateIssue, isLoading: false, error: action.error },
      }

    // Delete Issue
    case ISSUE_ACTION_TYPES.DELETE_ISSUE + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        deleteIssue: { ...state.deleteIssue, isLoading: true, error: null },
      }
    case ISSUE_ACTION_TYPES.DELETE_ISSUE + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        deleteIssue: { isLoading: false, data: action.data, error: null },
        fetchIssues: {
          ...state.fetchIssues,
          data: state.fetchIssues.data.filter((issue) => issue.id !== action.data),
        },
      }
    case ISSUE_ACTION_TYPES.DELETE_ISSUE + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        deleteIssue: { ...state.deleteIssue, isLoading: false, error: action.error },
      }

    // Fetch Status Counts
    case ISSUE_ACTION_TYPES.FETCH_STATUS_COUNTS + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        fetchStatusCounts: { ...state.fetchStatusCounts, isLoading: true, error: null },
      }
    case ISSUE_ACTION_TYPES.FETCH_STATUS_COUNTS + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        fetchStatusCounts: { isLoading: false, data: action.data, error: null },
      }
    case ISSUE_ACTION_TYPES.FETCH_STATUS_COUNTS + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        fetchStatusCounts: { ...state.fetchStatusCounts, isLoading: false, error: action.error },
      }

    // Fetch Metadata
    case ISSUE_ACTION_TYPES.FETCH_METADATA + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        fetchMetadata: { ...state.fetchMetadata, isLoading: true, error: null },
      }
    case ISSUE_ACTION_TYPES.FETCH_METADATA + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        fetchMetadata: { isLoading: false, data: action.data, error: null },
      }
    case ISSUE_ACTION_TYPES.FETCH_METADATA + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        fetchMetadata: { ...state.fetchMetadata, isLoading: false, error: action.error },
      }

    // Fetch My Issues
    case ISSUE_ACTION_TYPES.FETCH_MY_ISSUES + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        fetchMyIssues: { ...state.fetchMyIssues, isLoading: true, error: null },
      }
    case ISSUE_ACTION_TYPES.FETCH_MY_ISSUES + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        fetchMyIssues: { isLoading: false, data: action.data, error: null },
      }
    case ISSUE_ACTION_TYPES.FETCH_MY_ISSUES + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        fetchMyIssues: { ...state.fetchMyIssues, isLoading: false, error: action.error },
      }

    // Fetch My Status Counts
    case ISSUE_ACTION_TYPES.FETCH_MY_STATUS_COUNTS + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        fetchMyStatusCounts: { ...state.fetchMyStatusCounts, isLoading: true, error: null },
      }
    case ISSUE_ACTION_TYPES.FETCH_MY_STATUS_COUNTS + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        fetchMyStatusCounts: { isLoading: false, data: action.data, error: null },
      }
    case ISSUE_ACTION_TYPES.FETCH_MY_STATUS_COUNTS + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        fetchMyStatusCounts: {
          ...state.fetchMyStatusCounts,
          isLoading: false,
          error: action.error,
        },
      }

    // Clear Current Issue
    case ISSUE_ACTION_TYPES.CLEAR_CURRENT_ISSUE:
      return {
        ...state,
        fetchIssue: { ...state.fetchIssue, data: null },
      }

    default:
      return state
  }
}

export default issueReducer
