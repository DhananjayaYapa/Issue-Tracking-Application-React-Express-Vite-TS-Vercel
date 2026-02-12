import { API_ROUTES } from '../utilities/constants'
import type {
  Issue,
  IssueFiltersDto,
  CreateIssuePayload,
  StatusCountsDto,
  ApiResponseDto,
  IssueMetadataDto,
  ExportFiltersDto,
  UpdateIssueStatusDto,
  IssueParams,
} from '../utilities/models'
import { axiosPrivateInstance } from './index'

const getIssues = (filters?: IssueFiltersDto) => {
  return axiosPrivateInstance.get<ApiResponseDto<Issue[]>>(API_ROUTES.ISSUES, { params: filters })
}

const getIssue = (params: IssueParams) => {
  return axiosPrivateInstance.get<ApiResponseDto<Issue>>(API_ROUTES.ISSUE_BY_ID(params.id))
}

const createIssue = (payload: CreateIssuePayload) => {
  const formData = new FormData()
  formData.append('title', payload.title)
  formData.append('description', payload.description)
  formData.append('priority', payload.priority)
  if (payload.status) formData.append('status', payload.status)
  if (payload.attachment) formData.append('attachment', payload.attachment)
  return axiosPrivateInstance.post<ApiResponseDto<Issue>>(API_ROUTES.ISSUES, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

const updateIssue = (params: IssueParams, payload: Partial<CreateIssuePayload>) => {
  const formData = new FormData()
  if (payload.title !== undefined) formData.append('title', payload.title)
  if (payload.description !== undefined) formData.append('description', payload.description)
  if (payload.priority) formData.append('priority', payload.priority)
  if (payload.status) formData.append('status', payload.status)
  if (payload.attachment) formData.append('attachment', payload.attachment)
  return axiosPrivateInstance.put<ApiResponseDto<Issue>>(
    API_ROUTES.ISSUE_BY_ID(params.id),
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  )
}

const updateIssueStatus = (payload: UpdateIssueStatusDto) => {
  return axiosPrivateInstance.patch<ApiResponseDto<Issue>>(API_ROUTES.ISSUE_STATUS(payload.id), {
    status: payload.status,
  })
}

const deleteIssue = (params: IssueParams) => {
  return axiosPrivateInstance.delete(API_ROUTES.ISSUE_BY_ID(params.id))
}

const getStatusCounts = () => {
  return axiosPrivateInstance.get<ApiResponseDto<StatusCountsDto>>(API_ROUTES.STATUS_COUNTS)
}

const getMyStatusCounts = () => {
  return axiosPrivateInstance.get<ApiResponseDto<StatusCountsDto>>(API_ROUTES.MY_STATUS_COUNTS)
}

const getMyIssues = (filters?: IssueFiltersDto) => {
  return axiosPrivateInstance.get<ApiResponseDto<Issue[]>>(API_ROUTES.MY_ISSUES, {
    params: filters,
  })
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
