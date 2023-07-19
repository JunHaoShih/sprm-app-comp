import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';

export interface UpdatePermissionDto {
  objectType: SprmObjectType,
  createPermitted: boolean,
  readPermitted: boolean,
  updatePermitted: boolean,
  deletePermitted: boolean,
}
