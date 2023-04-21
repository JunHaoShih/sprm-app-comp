import { defineStore } from 'pinia';
import { ObjectTypeId } from 'src/modules/objectTypes/models/ObjectType';
import { attributeLinkService } from '../services/AttributeLinkService';
import { AttributeLinks } from '../models/AttributeLinks';
import { CustomAttribute } from '../models/CustomAttribute';

export interface AttributeLinksContainer {
  content: AttributeLinks,
}

export const useAttributeLinksStore = defineStore('attributeLinks', {
  state: (): AttributeLinksContainer => ({
    content: {
      objectTypeId: ObjectTypeId.None,
      attributes: [],
    },
  }),
  actions: {
    async initialize(objectTypeId: ObjectTypeId): Promise<void> {
      const attrLinks = await attributeLinkService.getByObjectTypeId(objectTypeId);
      if (attrLinks) {
        this.content = attrLinks;
      }
    },
    deleteLinks(targetAttrs: CustomAttribute[]): void {
      this.content.attributes = this.content.attributes.filter(
        (attribute) => !targetAttrs.find((targetAttr) => targetAttr.id === attribute.id),
      );
    },
  },
});
