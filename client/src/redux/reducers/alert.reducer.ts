import {
  ISSUE_ACTION_TYPES,
  USER_ACTION_TYPES,
  EXPORT_ACTION_TYPES,
  COMMON_ACTION_TYPES,
} from '../../utilities/constants'
import type { AlertActionDto } from '../../utilities/models'

interface AlertState {
  message: string | null
  severity: 'success' | 'error' | 'warning' | 'info' | null
}

interface AlertReducerState {
  createIssueAlert: AlertState
  updateIssueAlert: AlertState
  deleteIssueAlert: AlertState
  deleteUserAlert: AlertState
  enableUserAlert: AlertState
  permanentDeleteUserAlert: AlertState
  downloadReportAlert: AlertState
}

const INITIAL_ALERT_STATE: AlertState = {
  message: null,
  severity: null,
}

const INITIAL_STATE: AlertReducerState = {
  createIssueAlert: { ...INITIAL_ALERT_STATE },
  updateIssueAlert: { ...INITIAL_ALERT_STATE },
  deleteIssueAlert: { ...INITIAL_ALERT_STATE },
  deleteUserAlert: { ...INITIAL_ALERT_STATE },
  enableUserAlert: { ...INITIAL_ALERT_STATE },
  permanentDeleteUserAlert: { ...INITIAL_ALERT_STATE },
  downloadReportAlert: { ...INITIAL_ALERT_STATE },
}

const alertReducer = (state = INITIAL_STATE, action: AlertActionDto): AlertReducerState => {
  switch (action.type) {
    // Create Issue
    case ISSUE_ACTION_TYPES.CREATE_ISSUE + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        createIssueAlert: {
          message: action.message,
          severity: action.severity,
        },
      }
    case ISSUE_ACTION_TYPES.CREATE_ISSUE + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        createIssueAlert: { ...INITIAL_ALERT_STATE },
      }

    // Update Issue
    case ISSUE_ACTION_TYPES.UPDATE_ISSUE + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        updateIssueAlert: {
          message: action.message,
          severity: action.severity,
        },
      }
    case ISSUE_ACTION_TYPES.UPDATE_ISSUE + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        updateIssueAlert: { ...INITIAL_ALERT_STATE },
      }

    // Delete Issue
    case ISSUE_ACTION_TYPES.DELETE_ISSUE + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        deleteIssueAlert: {
          message: action.message,
          severity: action.severity,
        },
      }
    case ISSUE_ACTION_TYPES.DELETE_ISSUE + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        deleteIssueAlert: { ...INITIAL_ALERT_STATE },
      }

    // Delete User (Disable)
    case USER_ACTION_TYPES.DELETE_USER + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        deleteUserAlert: {
          message: action.message,
          severity: action.severity,
        },
      }
    case USER_ACTION_TYPES.DELETE_USER + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        deleteUserAlert: { ...INITIAL_ALERT_STATE },
      }

    // Enable User
    case USER_ACTION_TYPES.ENABLE_USER + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        enableUserAlert: {
          message: action.message,
          severity: action.severity,
        },
      }
    case USER_ACTION_TYPES.ENABLE_USER + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        enableUserAlert: { ...INITIAL_ALERT_STATE },
      }

    // Permanent Delete User
    case USER_ACTION_TYPES.PERMANENT_DELETE_USER + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        permanentDeleteUserAlert: {
          message: action.message,
          severity: action.severity,
        },
      }
    case USER_ACTION_TYPES.PERMANENT_DELETE_USER + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        permanentDeleteUserAlert: { ...INITIAL_ALERT_STATE },
      }

    // Download Report
    case EXPORT_ACTION_TYPES.DOWNLOAD_REPORT + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        downloadReportAlert: {
          message: action.message,
          severity: action.severity,
        },
      }
    case EXPORT_ACTION_TYPES.DOWNLOAD_REPORT + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        downloadReportAlert: { ...INITIAL_ALERT_STATE },
      }

    default:
      return state
  }
}

export default alertReducer
