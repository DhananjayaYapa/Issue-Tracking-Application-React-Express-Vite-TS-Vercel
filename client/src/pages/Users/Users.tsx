import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Tooltip,
  Alert,
  Typography,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
} from '@mui/icons-material'
import type { RootState } from '../../redux/store'
import { userActions } from '../../redux/actions'
import { AppLayoutHeader } from '../../templates'
import { ConfirmationDialog, LoadingOverlay, PageHeader } from '../../components/shared'
import { formatDate } from '../../utilities/helpers/commonFunctions'

const Users: React.FC = () => {
  const dispatch = useDispatch()
  const { users, isLoading, error } = useSelector((state: RootState) => state.users)
  const currentUser = useSelector((state: RootState) => state.auth.user)

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean
    userId: number | null
    userName: string
  }>({
    open: false,
    userId: null,
    userName: '',
  })

  useEffect(() => {
    dispatch(userActions.fetchUsersRequest())
  }, [dispatch])

  const handleDeleteClick = (userId: number, userName: string) => {
    setDeleteConfirm({ open: true, userId, userName })
  }

  const handleDeleteConfirm = () => {
    if (deleteConfirm.userId) {
      dispatch(userActions.deleteUserRequest(deleteConfirm.userId))
    }
    setDeleteConfirm({ open: false, userId: null, userName: '' })
  }

  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, userId: null, userName: '' })
  }

  return (
    <Box>
      <AppLayoutHeader componentBreadCrumb="Users" componentTitle="User Management" />

      <Box sx={{ mt: 3 }}>
        <PageHeader title="All Users" subtitle={`${users.length} users found`} />

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
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="text.secondary" sx={{ py: 4 }}>
                        No users found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.userId} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {user.role === 'admin' ? (
                            <AdminIcon color="primary" fontSize="small" />
                          ) : (
                            <UserIcon color="action" fontSize="small" />
                          )}
                          {user.name}
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role.toUpperCase()}
                          size="small"
                          color={user.role === 'admin' ? 'primary' : 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{user.createdAt ? formatDate(user.createdAt) : '-'}</TableCell>
                      <TableCell align="right">
                        {user.role !== 'admin' && user.userId !== currentUser?.userId && (
                          <Tooltip title="Delete User">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteClick(user.userId, user.name)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <ConfirmationDialog
        open={deleteConfirm.open}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteConfirm.userName}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  )
}

export default Users
