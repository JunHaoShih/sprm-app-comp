import { ObjectTypeId } from 'src/modules/objectTypes/models/ObjectType';

export interface CreateAttributeLinksDTO {
  objectTypeId: ObjectTypeId,
  attributeIds: number[],
}
