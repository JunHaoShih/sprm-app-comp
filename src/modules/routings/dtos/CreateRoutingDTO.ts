export interface CreateRoutingDTO {
  partId: number,
  name: string,
  remarks?: string,
  customValues: Record<string, string>,
}
