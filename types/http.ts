export type ErrorLike = {
  statusCode?: number
  status?: number
  statusMessage?: string
  message?: string
  data?: {
    statusMessage?: string
    message?: string
  }
  response?: {
    status?: number
  }
}
