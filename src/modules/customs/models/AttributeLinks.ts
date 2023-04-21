import { ObjectTypeId } from 'src/modules/objectTypes/models/ObjectType';
import { CustomAttribute } from './CustomAttribute';

export interface AttributeLinks {
  objectTypeId: ObjectTypeId,
  attributes: CustomAttribute[]
}
