/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from 'redux-saga/effects'
import { issueService } from '../../services'
import { ISSUE_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import { dispatchAlert } from '../../utilities/helpers'
import type {
  IssueFiltersDto,
  CreateIssuePayload,
  UpdateIssuePayload,
  IssueParams,
} from '../../utilities/models'

// Fetch issues list saga
function* fetchIssuesSaga(action: { type: string; params?: { filters?: IssueFiltersDto } }) {
  try {
    // @ts-expect-error-ignore
    const response = yield call(issueService.getIssues, action.params?.filters)
    yield put({
      type: ISSUE_ACTION_TYPES.FETCH_ISSUES + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
  } catch (error: any) {
    yield put({
      type: ISSUE_ACTION_TYPES.FETCH_ISSUES + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
  }
}

// Fetch single issue saga
function* fetchIssueSaga(action: { type: string; params: IssueParams }) {
  try {
    // @ts-expect-error-ignore
    const response = yield call(issueService.getIssue, action.params)
    yield put({
      type: ISSUE_ACTION_TYPES.FETCH_ISSUE + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
  } catch (error: any) {
    yield put({
      type: ISSUE_ACTION_TYPES.FETCH_ISSUE + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
  }
}

// Create issue saga
function* createIssueSaga(action: { type: string; payload: CreateIssuePayload }) {
  try {
    // @ts-expect-error-ignore
    const response = yield call(issueService.createIssue, action.payload)
    yield put({
      type: ISSUE_ACTION_TYPES.CREATE_ISSUE + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
    yield* dispatchAlert(
      ISSUE_ACTION_TYPES.CREATE_ISSUE,
      response.data.message || 'Issue created successfully',
      'success'
    )
  } catch (error: any) {
    yield put({
      type: ISSUE_ACTION_TYPES.CREATE_ISSUE + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
    const backendMessage =
      error?.response?.data?.message || error?.response?.data?.error || error?.message
    yield* dispatchAlert(
      ISSUE_ACTION_TYPES.CREATE_ISSUE,
      backendMessage || 'Failed to create issue',
      'error'
    )
  }
}

// Update issue saga
function* updateIssueSaga(action: { type: string; payload: UpdateIssuePayload }) {
  try {
    const { id, ...data } = action.payload
    // @ts-expect-error-ignore
    const response = yield call(issueService.updateIssue, { id }, data)
    yield put({
      type: ISSUE_ACTION_TYPES.UPDATE_ISSUE + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
    yield* dispatchAlert(
      ISSUE_ACTION_TYPES.UPDATE_ISSUE,
      response.data.message || 'Issue updated successfully',
      'success'
    )
  } catch (error: any) {
    yield put({
      type: ISSUE_ACTION_TYPES.UPDATE_ISSUE + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
    const backendMessage =
      error?.response?.data?.message || error?.response?.data?.error || error?.message
    yield* dispatchAlert(
      ISSUE_ACTION_TYPES.UPDATE_ISSUE,
      backendMessage || 'Failed to update issue',
      'error'
    )
  }
}

// Delete issue saga
function* deleteIssueSaga(action: { type: string; params: IssueParams }) {
  try {
    yield call(issueService.deleteIssue, action.params)
    yield put({
      type: ISSUE_ACTION_TYPES.DELETE_ISSUE + COMMON_ACTION_TYPES.SUCCESS,
      data: action.params.id,
    })
    yield* dispatchAlert(ISSUE_ACTION_TYPES.DELETE_ISSUE, 'Issue deleted successfully', 'success')
  } catch (error: any) {
    yield put({
      type: ISSUE_ACTION_TYPES.DELETE_ISSUE + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
    const backendMessage =
      error?.response?.data?.message || error?.response?.data?.error || error?.message
    yield* dispatchAlert(
      ISSUE_ACTION_TYPES.DELETE_ISSUE,
      backendMessage || 'Failed to delete issue',
      'error'
    )
  }
}

// Fetch status counts saga
function* fetchStatusCountsSaga() {
  try {
    // @ts-expect-error-ignore
    const response = yield call(issueService.getStatusCounts)
    yield put({
      type: ISSUE_ACTION_TYPES.FETCH_STATUS_COUNTS + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
  } catch (error: any) {
    yield put({
      type: ISSUE_ACTION_TYPES.FETCH_STATUS_COUNTS + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
  }
}

// Fetch metadata saga
function* fetchMetadataSaga() {
  try {
    // @ts-expect-error-ignore
    const response = yield call(issueService.getMetadata)
    yield put({
      type: ISSUE_ACTION_TYPES.FETCH_METADATA + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
  } catch (error: any) {
    yield put({
      type: ISSUE_ACTION_TYPES.FETCH_METADATA + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
  }
}

// Fetch my issues saga
function* fetchMyIssuesSaga(action: { type: string; params?: { filters?: IssueFiltersDto } }) {
  try {
    // @ts-expect-error-ignore
    const response = yield call(issueService.getMyIssues, action.params?.filters)
    yield put({
      type: ISSUE_ACTION_TYPES.FETCH_MY_ISSUES + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
  } catch (error: any) {
    yield put({
      type: ISSUE_ACTION_TYPES.FETCH_MY_ISSUES + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
  }
}

// Fetch my status counts saga
function* fetchMyStatusCountsSaga() {
  try {
    // @ts-expect-error-ignore
    const response = yield call(issueService.getMyStatusCounts)
    yield put({
      type: ISSUE_ACTION_TYPES.FETCH_MY_STATUS_COUNTS + COMMON_ACTION_TYPES.SUCCESS,
      data: response.data.data,
    })
  } catch (error: any) {
    yield put({
      type: ISSUE_ACTION_TYPES.FETCH_MY_STATUS_COUNTS + COMMON_ACTION_TYPES.ERROR,
      error: error as string,
    })
  }
}

// Watcher saga
export default function* issueSaga() {
  yield takeLatest(ISSUE_ACTION_TYPES.FETCH_ISSUES + COMMON_ACTION_TYPES.REQUEST, fetchIssuesSaga)
  yield takeLatest(ISSUE_ACTION_TYPES.FETCH_ISSUE + COMMON_ACTION_TYPES.REQUEST, fetchIssueSaga)
  yield takeLatest(ISSUE_ACTION_TYPES.CREATE_ISSUE + COMMON_ACTION_TYPES.REQUEST, createIssueSaga)
  yield takeLatest(ISSUE_ACTION_TYPES.UPDATE_ISSUE + COMMON_ACTION_TYPES.REQUEST, updateIssueSaga)
  yield takeLatest(ISSUE_ACTION_TYPES.DELETE_ISSUE + COMMON_ACTION_TYPES.REQUEST, deleteIssueSaga)
  yield takeLatest(
    ISSUE_ACTION_TYPES.FETCH_STATUS_COUNTS + COMMON_ACTION_TYPES.REQUEST,
    fetchStatusCountsSaga
  )
  yield takeLatest(
    ISSUE_ACTION_TYPES.FETCH_METADATA + COMMON_ACTION_TYPES.REQUEST,
    fetchMetadataSaga
  )
  yield takeLatest(
    ISSUE_ACTION_TYPES.FETCH_MY_ISSUES + COMMON_ACTION_TYPES.REQUEST,
    fetchMyIssuesSaga
  )
  yield takeLatest(
    ISSUE_ACTION_TYPES.FETCH_MY_STATUS_COUNTS + COMMON_ACTION_TYPES.REQUEST,
    fetchMyStatusCountsSaga
  )
}
