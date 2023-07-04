export interface UpdateProcessDTO {
  number: string,
  name: string,
  remarks: string | null,
  processTypeId: number,
  defaultMakeTypeId: number,
  defaultImportTime: number,
  defaultExportTime: number,
  customValues: Record<string, string>,
}
