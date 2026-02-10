import { API_ROUTES } from '../utilities/constants'
import type {
  Issue,
  IssueFiltersDto,
  CreateIssuePayload,
  StatusCountsDto,
  ApiResponseDto,
  IssueMetadataDto,
  ExportFiltersDto,
} from '../utilities/models'
import { axiosPrivateInstance } from './index'

const getIssues = (params?: IssueFiltersDto) => {
  return axiosPrivateInstance.get<ApiResponseDto<Issue[]>>(API_ROUTES.ISSUES, { params })
}

const getIssue = (id: number) => {
  return axiosPrivateInstance.get<ApiResponseDto<Issue>>(API_ROUTES.ISSUE_BY_ID(id))
}

const createIssue = (payload: CreateIssuePayload) => {
  const formData = new FormData()
  formData.append('title', payload.title)
  if (payload.description) formData.append('description', payload.description)
  if (payload.priority) formData.append('priority', payload.priority)
  if (payload.status) formData.append('status', payload.status)
  if (payload.attachment) formData.append('attachment', payload.attachment)
  return axiosPrivateInstance.post<ApiResponseDto<Issue>>(API_ROUTES.ISSUES, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

const updateIssue = (id: number, payload: Partial<CreateIssuePayload>) => {
  const formData = new FormData()
  if (payload.title !== undefined) formData.append('title', payload.title)
  if (payload.description !== undefined) formData.append('description', payload.description)
  if (payload.priority) formData.append('priority', payload.priority)
  if (payload.status) formData.append('status', payload.status)
  if (payload.attachment) formData.append('attachment', payload.attachment)
  return axiosPrivateInstance.put<ApiResponseDto<Issue>>(API_ROUTES.ISSUE_BY_ID(id), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

const updateIssueStatus = (id: number, status: string) => {
  return axiosPrivateInstance.patch<ApiResponseDto<Issue>>(API_ROUTES.ISSUE_STATUS(id), { status })
}

const deleteIssue = (id: number) => {
  return axiosPrivateInstance.delete(API_ROUTES.ISSUE_BY_ID(id))
}

const getStatusCounts = () => {
  return axiosPrivateInstance.get<ApiResponseDto<StatusCountsDto>>(API_ROUTES.STATUS_COUNTS)
}

const getMyStatusCounts = () => {
  return axiosPrivateInstance.get<ApiResponseDto<StatusCountsDto>>(API_ROUTES.MY_STATUS_COUNTS)
}

const getMyIssues = (params?: IssueFiltersDto) => {
  return axiosPrivateInstance.get<ApiResponseDto<Issue[]>>(API_ROUTES.MY_ISSUES, { params })
}

const exportCsv = (params?: ExportFiltersDto) => {
  return axiosPrivateInstance.get(API_ROUTES.EXPORT_CSV, {
    params,
    responseType: 'blob',
  })
}

const exportJson = (params?: ExportFiltersDto) => {
  return axiosPrivateInstance.get(API_ROUTES.EXPORT_JSON, {
    params,
    responseType: 'blob',
  })
}

const getMetadata = () => {
  return axiosPrivateInstance.get<ApiResponseDto<IssueMetadataDto>>(API_ROUTES.METADATA)
}

export const issueService = {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  updateIssueStatus,
  deleteIssue,
  getStatusCounts,
  getMyStatusCounts,
  getMyIssues,
  exportCsv,
  exportJson,
  getMetadata,
}
