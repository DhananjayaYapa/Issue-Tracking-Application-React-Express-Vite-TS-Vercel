import React from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Select,
  MenuItem,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Comment as CommentIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  RadioButtonUnchecked as OpenIcon,
  Autorenew as InProgressIcon,
  CheckCircleOutline as ResolvedIcon,
  HighlightOff as ClosedIcon,
  ArrowDownward as LowIcon,
  ArrowForward as MediumIcon,
  ArrowUpward as HighIcon,
  PriorityHigh as CriticalIcon,
} from '@mui/icons-material'
import { StatusChip, LoadingOverlay } from '../../shared'
import type { Issue, IssueStatus } from '../../../utilities/models'
import { ISSUE_STATUS } from '../../../utilities/constants'
import styles from './IssueTable.module.scss'
import {
  getStatusIcon,
  getPriorityIcon,
  formatDate,
} from '../../../utilities/helpers/commonFunctions'

interface IssueTableProps {
  issues: Issue[]
  loading: boolean
  onEdit: (issue: Issue) => void
  onDelete: (id: number) => void
  onComment?: (issue: Issue) => void
  onView?: (issue: Issue) => void
  onStatusChange?: (issueId: number, status: IssueStatus) => void
  editingStatusId?: number | null
  onEditStatusToggle?: (issueId: number | null) => void
  showActions?: boolean
  showStatusIcons?: boolean
  showPriorityIcons?: boolean
}

const IssueTable: React.FC<IssueTableProps> = ({
  issues,
  loading,
  onEdit,
  onDelete,
  onComment,
  onView,
  onStatusChange,
  editingStatusId = null,
  onEditStatusToggle,
  showActions = true,
  showStatusIcons = false,
  showPriorityIcons = false,
}) => {
  return (
    <>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <LoadingOverlay loading={loading} minHeight={300}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Created</TableCell>
                {showActions && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {issues?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={showActions ? 6 : 5} align="center">
                    <Typography color="text.secondary" py={4}>
                      No issues found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                issues?.map((issue) => (
                  <TableRow key={issue.id} hover>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={{
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {issue.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {editingStatusId === issue.id ? (
                        <Select
                          size="small"
                          value={issue.status}
                          onChange={(e: SelectChangeEvent) => {
                            onStatusChange?.(issue.id, e.target.value as IssueStatus)
                          }}
                          sx={{ minWidth: 140 }}
                        >
                          {Object.values(ISSUE_STATUS).map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : showStatusIcons ? (
                        <Tooltip title={issue.status}>
                          <IconButton size="small">{getStatusIcon(issue.status)}</IconButton>
                        </Tooltip>
                      ) : (
                        <StatusChip variant="status" value={issue.status} />
                      )}
                    </TableCell>
                    <TableCell>
                      {showPriorityIcons ? (
                        <Tooltip title={issue.priority}>
                          <IconButton size="small">{getPriorityIcon(issue.priority)}</IconButton>
                        </Tooltip>
                      ) : (
                        <StatusChip variant="priority" value={issue.priority} outlined />
                      )}
                    </TableCell>
                    <TableCell>{issue.createdBy.name}</TableCell>
                    <TableCell>{formatDate(issue.createdAt)}</TableCell>
                    {showActions && (
                      <TableCell align="right">
                        {editingStatusId === issue.id ? (
                          <Tooltip title="Cancel">
                            <IconButton size="small" onClick={() => onEditStatusToggle?.(null)}>
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title={issue.status === 'Closed' ? 'Closed' : 'Edit Status'}>
                            <span>
                              <IconButton
                                size="small"
                                disabled={issue.status === 'Closed'}
                                onClick={() =>
                                  onEditStatusToggle ? onEditStatusToggle(issue.id) : onEdit(issue)
                                }
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                        {onView && (
                          <Tooltip title="View">
                            <IconButton size="small" onClick={() => onView(issue)}>
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onComment && (
                          <Tooltip title="Comment">
                            <IconButton size="small" onClick={() => onComment(issue)}>
                              <CommentIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => onDelete(issue.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}

              {issues?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={showActions ? 6 : 5} align="center">
                    <Typography color="text.secondary" py={4}>
                      No issues found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </LoadingOverlay>
      </TableContainer>

      {(showStatusIcons || showPriorityIcons) && (
        <Box
          sx={{
            mt: 1,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            fontSize: '0.75rem',
            color: 'text.secondary',
          }}
        >
          {showStatusIcons && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" sx={{ fontWeight: 600 }}>
                Status:
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <OpenIcon fontSize="inherit" color="info" /> Open
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <InProgressIcon fontSize="inherit" color="warning" /> In Progress
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ResolvedIcon fontSize="inherit" color="success" /> Resolved
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ClosedIcon fontSize="inherit" color="disabled" /> Closed
              </Box>
            </Box>
          )}

          {showPriorityIcons && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" sx={{ fontWeight: 600 }}>
                Priority:
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LowIcon fontSize="inherit" color="success" /> Low
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <MediumIcon fontSize="inherit" color="warning" /> Medium
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <HighIcon fontSize="inherit" color="error" /> High
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CriticalIcon fontSize="inherit" color="error" /> Critical
              </Box>
            </Box>
          )}
        </Box>
      )}
    </>
  )
}

export default IssueTable
