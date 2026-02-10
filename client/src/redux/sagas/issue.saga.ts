/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from 'redux-saga/effects'
import { issueService } from '../../services'
import { issueActions } from '../actions'
import { ISSUE_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import type {
  IssueFiltersDto,
  CreateIssuePayload,
  UpdateIssuePayload,
  Issue,
  StatusCountsDto,
  ApiResponseDto,
  IssueMetadataDto,
} from '../../utilities/models'
import type { AxiosResponse } from 'axios'

// Fetch issues list saga
function* fetchIssuesSaga(action: { type: string; payload: IssueFiltersDto }) {
  try {
    const response: AxiosResponse<ApiResponseDto<Issue[]>> = yield call(
      issueService.getIssues,
      action.payload
    )
    yield put(issueActions.fetchIssuesSuccess(response.data.data))
  } catch (error: any) {
    yield put(issueActions.fetchIssuesError(error))
  }
}

// Fetch single issue saga
function* fetchIssueSaga(action: { type: string; payload: number }) {
  try {
    const response: AxiosResponse<ApiResponseDto<Issue>> = yield call(
      issueService.getIssue,
      action.payload
    )
    yield put(issueActions.fetchIssueSuccess(response.data.data))
  } catch (error: any) {
    yield put(issueActions.fetchIssueError(error))
  }
}

// Create issue saga
function* createIssueSaga(action: { type: string; payload: CreateIssuePayload }) {
  try {
    const response: AxiosResponse<ApiResponseDto<Issue>> = yield call(
      issueService.createIssue,
      action.payload
    )
    yield put(issueActions.createIssueSuccess(response.data.data))
  } catch (error: any) {
    yield put(issueActions.createIssueError(error))
  }
}

// Update issue saga
function* updateIssueSaga(action: { type: string; payload: UpdateIssuePayload }) {
  try {
    const { id, ...data } = action.payload
    const response: AxiosResponse<ApiResponseDto<Issue>> = yield call(
      issueService.updateIssue,
      id,
      data
    )
    yield put(issueActions.updateIssueSuccess(response.data.data))
  } catch (error: any) {
    yield put(issueActions.updateIssueError(error))
  }
}

// Delete issue saga
function* deleteIssueSaga(action: { type: string; payload: number }) {
  try {
    yield call(issueService.deleteIssue, action.payload)
    yield put(issueActions.deleteIssueSuccess(action.payload))
  } catch (error: any) {
    yield put(issueActions.deleteIssueError(error))
  }
}

// Fetch status counts saga
function* fetchStatusCountsSaga() {
  try {
    const response: AxiosResponse<ApiResponseDto<StatusCountsDto>> = yield call(
      issueService.getStatusCounts
    )
    yield put(issueActions.fetchStatusCountsSuccess(response.data.data))
  } catch (error: any) {
    yield put(issueActions.fetchStatusCountsError(error))
  }
}

// Fetch metadata saga
function* fetchMetadataSaga() {
  try {
    const response: AxiosResponse<ApiResponseDto<IssueMetadataDto>> = yield call(
      issueService.getMetadata
    )
    yield put(issueActions.fetchMetadataSuccess(response.data.data))
  } catch (error: any) {
    yield put(issueActions.fetchMetadataError(error))
  }
}

function* fetchMyIssuesSaga(action: { type: string; params?: IssueFiltersDto }) {
  try {
    const response: AxiosResponse<ApiResponseDto<Issue[]>> = yield call(
      issueService.getMyIssues,
      action.params
    )
    yield put(issueActions.fetchMyIssuesSuccess(response.data.data))
  } catch (error: any) {
    yield put(issueActions.fetchMyIssuesError(error))
  }
}

// Fetch my status counts saga
function* fetchMyStatusCountsSaga() {
  try {
    const response: AxiosResponse<ApiResponseDto<StatusCountsDto>> = yield call(
      issueService.getMyStatusCounts
    )
    yield put(issueActions.fetchMyStatusCountsSuccess(response.data.data))
  } catch (error: any) {
    yield put(issueActions.fetchMyStatusCountsError(error))
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
