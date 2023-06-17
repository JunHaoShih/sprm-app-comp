import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';

export interface CreateAttributeLinksDTO {
  objectTypeId: SprmObjectType,
  attributeIds: number[],
}
