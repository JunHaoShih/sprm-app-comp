import { ReturnBase } from 'src/models/ReturnBase';

export interface AppUser extends ReturnBase {
  id: number,
  username: string,
  fullName: string,
  isAdmin: boolean,
  customValues: Record<string, string>,
}
