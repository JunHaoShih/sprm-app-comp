import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import { CustomAttribute } from './CustomAttribute';

export interface AttributeLinks {
  objectTypeId: SprmObjectType,
  attributes: CustomAttribute[]
}
