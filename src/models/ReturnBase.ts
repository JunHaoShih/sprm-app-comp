/**
 * SPRM API回傳基本型別
 */
export interface ReturnBase {
  id: number,
  createUser: string,
  createDate: Date,
  updateUser: string,
  updateDate: Date,
  remarks: string | null,
}
