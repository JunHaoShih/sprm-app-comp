export interface UpdateRoutingUsageDTO {
  remarks: string | null,
  number: string,
  processId: number,
  customValues: Record<string, string>,
}
