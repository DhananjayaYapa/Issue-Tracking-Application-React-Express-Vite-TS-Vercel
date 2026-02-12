import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './auth.reducer'
import issueReducer from './issue.reducer'
import userReducer from './user.reducer'
import alertReducer from './alert.reducer'

const rootReducer = combineReducers({
  auth: authReducer,
  issues: issueReducer,
  users: userReducer,
  alert: alertReducer,
})

export default rootReducer
