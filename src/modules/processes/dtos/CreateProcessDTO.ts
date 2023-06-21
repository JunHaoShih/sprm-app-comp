export interface CreateProcessDTO {
  number: string,
  name: string,
  remarks: string,
  processTypeId: number,
  defaultMakeTypeId: number,
  defaultImportTime: number,
  defaultExportTime: number,
  customValues: Record<string, string>,
}
