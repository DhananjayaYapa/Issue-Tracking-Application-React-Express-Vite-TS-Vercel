// Status colors for badges
export const STATUS_COLORS: Record<
  string,
  'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
> = {
  Open: 'info',
  'In Progress': 'warning',
  Resolved: 'success',
  Closed: 'default',
}

export const PRIORITY_COLORS: Record<
  string,
  'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
> = {
  Low: 'default',
  Medium: 'primary',
  High: 'warning',
  Critical: 'error',
}
