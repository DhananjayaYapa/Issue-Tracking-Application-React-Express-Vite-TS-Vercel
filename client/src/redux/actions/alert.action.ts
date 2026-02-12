import {
  ISSUE_ACTION_TYPES,
  USER_ACTION_TYPES,
  EXPORT_ACTION_TYPES,
  COMMON_ACTION_TYPES,
} from '../../utilities/constants'

// Issue alerts
const clearCreateIssueAlert = () => ({
  type: ISSUE_ACTION_TYPES.CREATE_ISSUE + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

const clearUpdateIssueAlert = () => ({
  type: ISSUE_ACTION_TYPES.UPDATE_ISSUE + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

const clearDeleteIssueAlert = () => ({
  type: ISSUE_ACTION_TYPES.DELETE_ISSUE + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

// User alerts
const clearDeleteUserAlert = () => ({
  type: USER_ACTION_TYPES.DELETE_USER + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

const clearEnableUserAlert = () => ({
  type: USER_ACTION_TYPES.ENABLE_USER + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

const clearPermanentDeleteUserAlert = () => ({
  type: USER_ACTION_TYPES.PERMANENT_DELETE_USER + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

// Export/Report alerts
const clearDownloadReportAlert = () => ({
  type: EXPORT_ACTION_TYPES.DOWNLOAD_REPORT + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

export const alertActions = {
  // Issue
  clearCreateIssueAlert,
  clearUpdateIssueAlert,
  clearDeleteIssueAlert,
  // User
  clearDeleteUserAlert,
  clearEnableUserAlert,
  clearPermanentDeleteUserAlert,
  // Export
  clearDownloadReportAlert,
}
