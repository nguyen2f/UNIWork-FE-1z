// Common types shared across all modules

export interface PageMetadata {
  page: number
  size: number
  totalElements: number
}

export interface PaginatedResponse<T> {
  content: T[]
  metadata: PageMetadata
  success: boolean
  message?: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}
