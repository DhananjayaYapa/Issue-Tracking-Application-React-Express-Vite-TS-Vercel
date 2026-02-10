// Issue Status Values
const ISSUE_STATUS = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

// Issue Priority Values
const ISSUE_PRIORITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

// Valid values for validation
const VALID_STATUSES = Object.values(ISSUE_STATUS);
const VALID_PRIORITIES = Object.values(ISSUE_PRIORITY);

module.exports = {
  ISSUE_STATUS,
  ISSUE_PRIORITY,
  VALID_STATUSES,
  VALID_PRIORITIES,
};
