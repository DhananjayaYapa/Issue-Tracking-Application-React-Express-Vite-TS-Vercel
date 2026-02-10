/**
 * Role Constants
 * ==============
 * Centralized role and permission constants
 *
 * Pattern adapted from: Athena-web/src/utilities/constants/app.constants.ts
 * Uses the same feature-key pattern (APP_FEATURE_KEYS)
 */

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin' as const,
  USER: 'user' as const,
}

/**
 * Feature Keys
 * Same pattern as Athena APP_FEATURE_KEYS (FE0XX)
 * Each key maps to a specific permission/action
 */
export const APP_FEATURE_KEYS = {
  // Issue actions
  CREATE_ISSUE: 'IT_FE001',
  VIEW_OWN_ISSUES: 'IT_FE002',
  UPDATE_OWN_ISSUE: 'IT_FE003',
  VIEW_ALL_ISSUES: 'IT_FE004',
  DELETE_ISSUE: 'IT_FE005',
  CHANGE_ISSUE_STATUS: 'IT_FE006',

  // User management actions
  VIEW_ALL_USERS: 'IT_FE010',
  DELETE_USER: 'IT_FE011',

  // Stats & reports
  VIEW_ALL_STATUS_COUNTS: 'IT_FE020',
  EXPORT_ISSUES: 'IT_FE021',
} as const

/**
 * Role-Feature Mapping
 * Defines which features each role has access to
 * Same pattern as Olympus DB: feature_role_rel table
 */
export const ROLE_FEATURES: Record<string, string[]> = {
  [USER_ROLES.ADMIN]: [
    APP_FEATURE_KEYS.VIEW_ALL_ISSUES,
    APP_FEATURE_KEYS.DELETE_ISSUE,
    APP_FEATURE_KEYS.CHANGE_ISSUE_STATUS,
    APP_FEATURE_KEYS.VIEW_ALL_USERS,
    APP_FEATURE_KEYS.DELETE_USER,
    APP_FEATURE_KEYS.VIEW_ALL_STATUS_COUNTS,
    APP_FEATURE_KEYS.EXPORT_ISSUES,
  ],
  [USER_ROLES.USER]: [
    APP_FEATURE_KEYS.CREATE_ISSUE,
    APP_FEATURE_KEYS.VIEW_OWN_ISSUES,
    APP_FEATURE_KEYS.UPDATE_OWN_ISSUE,
  ],
}

/**
 * Check if a role has a specific feature permission
 * Same pattern as: Olympus checkUserRoleFeaturePermission()
 */
export const hasFeaturePermission = (role: string, featureKey: string): boolean => {
  const features = ROLE_FEATURES[role]
  if (!features) return false
  return features.includes(featureKey)
}

/**
 * Get all feature keys for a role
 */
export const getRoleFeatures = (role: string): string[] => {
  return ROLE_FEATURES[role] || []
}
