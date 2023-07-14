import { ReturnBase } from 'src/models/ReturnBase';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';

export interface Permission extends ReturnBase {
  objectType: SprmObjectType,
  createPermitted: boolean,
  readPermitted: boolean,
  updatePermitted: boolean,
  deletePermitted: boolean,
}

export type Crud = 'create' | 'read' | 'update' | 'delete';

export interface RoutePermission {
  objectType: SprmObjectType,
  cruds: Crud[],
}
