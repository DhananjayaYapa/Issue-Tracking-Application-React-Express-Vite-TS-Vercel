import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Alert,
  Typography,
  TextField,
  InputAdornment,
  TablePagination,
  Grid,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Search as SearchIcon,
  Block as DisableIcon,
  CheckCircle as EnableIcon,
} from '@mui/icons-material'
import type { RootState } from '../../redux/store'
import { userActions, alertActions } from '../../redux/actions'
import { AppLayoutHeader } from '../../templates'
import { ConfirmationDialog, LoadingOverlay, PageHeader } from '../../components/shared'
import { formatDate } from '../../utilities/helpers/commonFunctions'
import { APP_TABLE_CONFIG } from '../../utilities/constants'
import { paginationSx, StyledTableCell, StyledTableRow } from '../../assets/theme/theme'

const INITIAL_DELETE_CONFIRM_STATE = {
  open: false,
  userId: null as number | null,
  userName: '',
  actionType: 'disable' as 'disable' | 'enable' | 'permanent',
}

const Users: React.FC = () => {
  const dispatch = useDispatch()
  const { fetchUsers } = useSelector((state: RootState) => state.users)
  const { data: users, isLoading, error } = fetchUsers
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const deleteUserAlert = useSelector((state: RootState) => state.alert.deleteUserAlert)
  const enableUserAlert = useSelector((state: RootState) => state.alert.enableUserAlert)
  const permanentDeleteUserAlert = useSelector(
    (state: RootState) => state.alert.permanentDeleteUserAlert
  )

  const [deleteConfirm, setDeleteConfirm] = useState(INITIAL_DELETE_CONFIRM_STATE)
  const [searchInput, setSearchInput] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(0)

  // Filter users based on search input
  const filteredUsers = users.filter((user) => {
    if (!searchInput.trim()) return true
    const searchTerm = searchInput.trim().toLowerCase()
    return (
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
    )
  })

  useEffect(() => {
    dispatch(userActions.fetchUsers())
  }, [dispatch])

  const handleDisableClick = (userId: number, userName: string) => {
    setDeleteConfirm((prev) => ({ ...prev, open: true, userId, userName, actionType: 'disable' }))
  }

  const handleEnableClick = (userId: number, userName: string) => {
    setDeleteConfirm((prev) => ({ ...prev, open: true, userId, userName, actionType: 'enable' }))
  }

  const handlePermanentDeleteClick = (userId: number, userName: string) => {
    setDeleteConfirm((prev) => ({ ...prev, open: true, userId, userName, actionType: 'permanent' }))
  }

  const handleConfirm = () => {
    if (deleteConfirm.userId) {
      if (deleteConfirm.actionType === 'permanent') {
        dispatch(userActions.permanentDeleteUser({ id: deleteConfirm.userId }))
      } else if (deleteConfirm.actionType === 'enable') {
        dispatch(userActions.enableUser({ id: deleteConfirm.userId }))
      } else {
        dispatch(userActions.deleteUser({ id: deleteConfirm.userId }))
      }
    }
    setDeleteConfirm(INITIAL_DELETE_CONFIRM_STATE)
  }

  const handleCancel = () => {
    setDeleteConfirm(INITIAL_DELETE_CONFIRM_STATE)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  const handleClearDeleteUserAlert = () => {
    dispatch(alertActions.clearDeleteUserAlert())
  }

  const handleClearEnableUserAlert = () => {
    dispatch(alertActions.clearEnableUserAlert())
  }

  const handleClearPermanentDeleteUserAlert = () => {
    dispatch(alertActions.clearPermanentDeleteUserAlert())
  }

  const paginatedData = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const getConfirmDialogContent = () => {
    const { actionType, userName } = deleteConfirm
    switch (actionType) {
      case 'permanent':
        return {
          title: 'Permanently Delete User',
          message: `Are you sure you want to permanently delete "${userName}"? This will also delete all issues created by this user. This action cannot be undone.`,
        }
      case 'enable':
        return {
          title: 'Enable User',
          message: `Are you sure you want to enable "${userName}"? The user will be able to access the system again.`,
        }
      default:
        return {
          title: 'Disable User',
          message: `Are you sure you want to disable "${userName}"? The user will no longer be able to access the system.`,
        }
    }
  }

  const confirmDialogContent = getConfirmDialogContent()

  return (
    <Box>
      <AppLayoutHeader />

      <Box sx={{ mt: 3 }}>
        <PageHeader subtitle={`${filteredUsers.length} users found`} />

        <Box sx={{ mb: 2 }}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Search users..."
              value={searchInput}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 280, '& .MuiOutlinedInput-root': { borderRadius: 50 } }}
            />
          </Grid>
        </Box>

        {deleteUserAlert?.message && (
          <Alert
            severity={deleteUserAlert.severity ?? 'info'}
            onClose={handleClearDeleteUserAlert}
            sx={{ mb: 2 }}
          >
            {deleteUserAlert.message}
          </Alert>
        )}

        {enableUserAlert?.message && (
          <Alert
            severity={enableUserAlert.severity ?? 'info'}
            onClose={handleClearEnableUserAlert}
            sx={{ mb: 2 }}
          >
            {enableUserAlert.message}
          </Alert>
        )}

        {permanentDeleteUserAlert?.message && (
          <Alert
            severity={permanentDeleteUserAlert.severity ?? 'info'}
            onClose={handleClearPermanentDeleteUserAlert}
            sx={{ mb: 2 }}
          >
            {permanentDeleteUserAlert.message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <LoadingOverlay loading={isLoading} />
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Role</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Created</StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <StyledTableRow>
                    <StyledTableCell colSpan={6} align="center">
                      <Typography color="text.secondary" sx={{ py: 4 }}>
                        {searchInput ? 'No users match your search' : 'No users found'}
                      </Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                ) : (
                  paginatedData.map((user) => (
                    <StyledTableRow
                      key={user.userId}
                      hover
                      sx={{
                        ...(user.role === 'admin'
                          ? { '& td.MuiTableCell-body': { color: '#0166fe !important' } }
                          : {}),
                        ...(user.isEnabled === false ? { opacity: 0.6 } : {}),
                      }}
                    >
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {user.role === 'admin' ? (
                            <AdminIcon color="primary" fontSize="small" />
                          ) : (
                            <UserIcon color="action" fontSize="small" />
                          )}
                          {user.name}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>{user.email}</StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={user.role.toUpperCase()}
                          size="small"
                          color={user.role === 'admin' ? 'primary' : 'default'}
                          variant="outlined"
                          sx={
                            user.role === 'admin'
                              ? { borderColor: '#0166fe', color: '#0166fe' }
                              : {}
                          }
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={user.isEnabled !== false ? 'ENABLED' : 'DISABLED'}
                          size="small"
                          color={user.isEnabled !== false ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        {user.createdAt ? formatDate(user.createdAt) : '-'}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {user.role !== 'admin' && user.userId !== currentUser?.userId && (
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                            {user.isEnabled !== false ? (
                              <Tooltip title="Disable User">
                                <IconButton
                                  color="warning"
                                  size="small"
                                  onClick={() => handleDisableClick(user.userId, user.name)}
                                >
                                  <DisableIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Enable User">
                                <IconButton
                                  color="success"
                                  size="small"
                                  onClick={() => handleEnableClick(user.userId, user.name)}
                                >
                                  <EnableIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Permanently Delete User">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handlePermanentDeleteClick(user.userId, user.name)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {filteredUsers.length > 0 && (
          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={APP_TABLE_CONFIG.ITEMS_PER_PAGE_OPTION}
            sx={paginationSx}
          />
        )}
      </Box>

      <ConfirmationDialog
        open={deleteConfirm.open}
        title={confirmDialogContent.title}
        message={confirmDialogContent.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </Box>
  )
}

export default Users
