export interface ServiceResult<T> {
  data: T
  receivedAt: string
}

export interface ServiceError {
  code: string
  message: string
  retryable: boolean
}
