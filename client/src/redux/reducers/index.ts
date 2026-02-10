import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './auth.reducer'
import issueReducer from './issue.reducer'
import userReducer from './user.reducer'

const rootReducer = combineReducers({
  auth: authReducer,
  issues: issueReducer,
  users: userReducer,
})

export default rootReducer
