export interface UpdatePartUsageDTO {
  quantity: number,
  remarks?: string | null,
  customValues: Record<string, string>,
}
