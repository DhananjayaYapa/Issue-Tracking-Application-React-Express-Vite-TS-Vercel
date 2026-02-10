/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Middleware, type Dispatch, type Action } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import rootReducer from '../reducers'
import rootSaga from '../sagas'

// Create saga middleware
const sagaMiddleware = createSagaMiddleware()

// Create logger middleware
const logger: Middleware = createLogger({
  collapsed: true,
  duration: true,
  timestamp: true,
  colors: {
    title: () => '#1976d2',
    prevState: () => '#9E9E9E',
    action: () => '#03A9F4',
    nextState: () => '#4CAF50',
    error: () => '#F44336',
  },
}) as Middleware<object, any, Dispatch<Action>>

// Get environment
const processEnv = import.meta.env.VITE_APP_ENV

// Configure store with reducers and saga middleware
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware: any) => {
    const middleware = getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    })

    // Add logger only in dev or local environments
    if (processEnv === 'dev' || processEnv === 'local') {
      middleware.push(logger)
    }

    middleware.push(sagaMiddleware)
    return middleware
  },
  devTools: processEnv !== 'production',
})

// Run root saga
sagaMiddleware.run(rootSaga)

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
