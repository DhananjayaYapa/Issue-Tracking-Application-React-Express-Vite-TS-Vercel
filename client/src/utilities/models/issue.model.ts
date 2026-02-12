export type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed'
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical'

export interface Issue {
  id: number
  title: string
  description: string | null
  status: IssueStatus
  priority: IssuePriority
  createdBy: {
    id: number
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  attachment: string | null
}

export interface CreateIssuePayload {
  title: string
  description: string
  priority: IssuePriority
  status?: IssueStatus
  attachment?: File | null
}

export interface UpdateIssuePayload extends Partial<CreateIssuePayload> {
  id: number
}

export interface UpdateIssueStatusDto {
  id: number
  status: IssueStatus
}

export interface IssueFiltersDto {
  status?: IssueStatus
  priority?: IssuePriority
  fromDate?: string
  toDate?: string
  createdBy?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ExportFiltersDto {
  status?: string
  priority?: string
  fromDate?: string
  toDate?: string
  createdBy?: number
}

export interface StatusCountsDto {
  Open: number
  'In Progress': number
  Resolved: number
  Closed: number
  total: number
}

export interface IssueMetadataDto {
  statuses: string[]
  priorities: string[]
}

// Params types for actions (admin-react-poc pattern)
export interface IssueParams {
  id: number
}

export interface FetchIssuesParams {
  filters?: IssueFiltersDto
}

export interface FetchMyIssuesParams {
  filters?: IssueFiltersDto
}

export interface IssueStateDto {
  issues: Issue[]
  currentIssue: Issue | null
  statusCounts: StatusCountsDto | null
  metadata: IssueMetadataDto | null
  filters: IssueFiltersDto
  isLoading: boolean
  error: string | null
}

export interface FormField {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  validator: string
  isRequired: boolean
  minLength?: number
  maxLength?: number
  error: string | null
}

export interface IssueFormData {
  title: FormField
  description: FormField
  status: FormField
  priority: FormField
}
