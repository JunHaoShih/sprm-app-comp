export interface OffsetPaginationResponse {
  /**
   * Current page
   */
  page: number,
  /**
   * Items per page
   */
  perPage: number,
  /**
   * Next page
   */
  nextPage?: number,
  /**
   * Previous page
   */
  previosPage?: number,
  /**
   * Total items
   */
  total: number,
  /**
   * Total pages
   */
  totalPages: number,
}

export interface OffsetPaginationData<T> {
  pagination: OffsetPaginationResponse,
  content: T,
}
