export interface CreateRoutingUsageDTO {
  remarks: string | null,
  rootVersionId: number,
  parentUsageId: number | null,
  number: string,
  processId: number,
  customValues: Record<string, string>,
}
