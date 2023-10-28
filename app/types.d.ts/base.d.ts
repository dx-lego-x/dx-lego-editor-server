export interface BaseResponse<T> {
  errno: number
  data?: T
  message?: string
}
