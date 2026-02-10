/**
 * Role Constants
 * ==============
 * Centralized role and permission constants
 *
 * Pattern adapted from: Athena-web/src/utilities/constants/app.constants.ts (APP_FEATURE_KEYS)
 * and: olympus-backend-services feature key pattern (FE0XX)
 */

// User Roles
const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

// Valid roles for validation
const VALID_ROLES = Object.values(USER_ROLES);

/**
 * Feature Keys
 * Similar to Olympus/Athena APP_FEATURE_KEYS pattern
 * Each feature key represents a specific permission/action
 */
const FEATURE_KEYS = {
  // Issue actions
  CREATE_ISSUE: "IT_FE001",
  VIEW_OWN_ISSUES: "IT_FE002",
  UPDATE_OWN_ISSUE: "IT_FE003",
  VIEW_ALL_ISSUES: "IT_FE004",
  DELETE_ISSUE: "IT_FE005",
  CHANGE_ISSUE_STATUS: "IT_FE006",

  // User management actions
  VIEW_ALL_USERS: "IT_FE010",
  DELETE_USER: "IT_FE011",

  // Stats & reports
  VIEW_ALL_STATUS_COUNTS: "IT_FE020",
  EXPORT_ISSUES: "IT_FE021",
};

/**
 * Role-Feature Mapping
 * Defines which features each role has access to
 * Similar to Olympus DB: feature_role_rel table
 */
const ROLE_FEATURES = {
  [USER_ROLES.ADMIN]: [
    FEATURE_KEYS.VIEW_ALL_ISSUES,
    FEATURE_KEYS.DELETE_ISSUE,
    FEATURE_KEYS.CHANGE_ISSUE_STATUS,
    FEATURE_KEYS.VIEW_ALL_USERS,
    FEATURE_KEYS.DELETE_USER,
    FEATURE_KEYS.VIEW_ALL_STATUS_COUNTS,
    FEATURE_KEYS.EXPORT_ISSUES,
  ],
  [USER_ROLES.USER]: [
    FEATURE_KEYS.CREATE_ISSUE,
    FEATURE_KEYS.VIEW_OWN_ISSUES,
    FEATURE_KEYS.UPDATE_OWN_ISSUE,
  ],
};

/**
 * Check if a role has a specific feature permission
 * Similar to: olympus checkUserRoleFeaturePermission()
 *
 * @param {string} role - User role
 * @param {string} featureKey - Feature key to check
 * @returns {boolean} - True if role has the feature
 */
const hasFeaturePermission = (role, featureKey) => {
  const features = ROLE_FEATURES[role];
  if (!features) return false;
  return features.includes(featureKey);
};

module.exports = {
  USER_ROLES,
  VALID_ROLES,
  FEATURE_KEYS,
  ROLE_FEATURES,
  hasFeaturePermission,
};
