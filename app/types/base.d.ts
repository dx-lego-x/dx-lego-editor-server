export interface BaseResponse<T> {
  errno: number
  data?: T
  message?: string
}

export interface IndexCondition {
  pageIndex?: number
  pageSize?: number
  select?: string | string[]
  populate?: { path?: string; select?: string } | string
  customSort?: Record<string, any>
  find?: Record<string, any>
}

export type ModelName = 'User' | 'Work'