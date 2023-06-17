import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';

export interface DeleteAttributeLinksDTO {
  objectTypeId: SprmObjectType,
  attributeIds: number[],
}
