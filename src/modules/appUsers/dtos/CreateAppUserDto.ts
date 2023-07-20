export interface CreateAppUserDto {
  username: string,
  password: string,
  fullName: string,
  isAdmin: boolean,
  remarks: string,
  customValues: Record<string, string>,
}
