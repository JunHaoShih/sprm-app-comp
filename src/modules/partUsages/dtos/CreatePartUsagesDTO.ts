export interface CreatePartUsageChildDTO {
  /**
   * Child part id(not part version)
   */
  partId: number,
  /**
   * Quantity of child part
   */
  quantity: number,
  /**
   * Custom values of this part usage
   */
  customValues: Record<string, string>,
}

export interface CreatePartUsagesDTO {
  /**
   * Parent part version id
   */
  partVersionId: number,
  /**
   * Children
   */
  children: CreatePartUsageChildDTO[]
}
