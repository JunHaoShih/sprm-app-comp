import { ObjectTypeId } from 'src/modules/objectTypes/models/ObjectType';

export interface DeleteAttributeLinksDTO {
  objectTypeId: ObjectTypeId,
  attributeIds: number[],
}
