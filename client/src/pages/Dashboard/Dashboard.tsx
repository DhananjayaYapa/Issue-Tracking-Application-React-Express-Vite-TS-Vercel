import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Grid, Card, CardContent, Typography } from '@mui/material'
import {
  BugReport as OpenIcon,
  Autorenew as InProgressIcon,
  CheckCircle as ResolvedIcon,
  Cancel as ClosedIcon,
} from '@mui/icons-material'
import { issueActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import { StatCard, WelcomeMessage } from '../../components/dashboard'
import { LoadingOverlay } from '../../components/shared'
import styles from './Dashboard.module.scss'

const Dashboard: React.FC = () => {
  const dispatch = useDispatch()
  const { statusCounts, myStatusCounts, isLoading } = useSelector(
    (state: RootState) => state.issues
  )
  const user = useSelector((state: RootState) => state.auth.user)

  const isAdmin = user?.role === 'admin'
  const counts = isAdmin ? statusCounts : myStatusCounts

  useEffect(() => {
    if (isAdmin) {
      dispatch(issueActions.fetchStatusCountsRequest())
    } else {
      dispatch(issueActions.fetchMyStatusCountsRequest())
    }
  }, [dispatch, isAdmin])

  const stats = [
    {
      title: 'Open',
      count: counts?.Open || 0,
      icon: <OpenIcon fontSize="large" />,
      color: '#0288d1',
    },
    {
      title: 'In Progress',
      count: counts?.['In Progress'] || 0,
      icon: <InProgressIcon fontSize="large" />,
      color: '#ed6c02',
    },
    {
      title: 'Resolved',
      count: counts?.Resolved || 0,
      icon: <ResolvedIcon fontSize="large" />,
      color: '#2e7d32',
    },
    {
      title: 'Closed',
      count: counts?.Closed || 0,
      icon: <ClosedIcon fontSize="large" />,
      color: '#757575',
    },
  ]

  return (
    <Box className={styles.dashboard}>
      <WelcomeMessage userName={user?.name} />
      <LoadingOverlay loading={isLoading} minHeight={200}>
        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>
      </LoadingOverlay>
      <Box className={styles.totalSection}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Issues
            </Typography>
            <Typography variant="h3" fontWeight={600} color="primary">
              {counts?.total || 0}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default Dashboard
