import { defineStore } from 'pinia';
import { ObjectTypeId } from 'src/modules/objectTypes/models/ObjectType';
import { attributeLinkService } from '../services/AttributeLinkService';
import { AttributeLinks } from '../models/AttributeLinks';
import { CustomAttribute } from '../models/CustomAttribute';

export interface AttributeLinksContainer {
  linksMap: Map<ObjectTypeId, AttributeLinks>,
}

export const useAttributeLinksStore = defineStore('attributeLinks', {
  state: (): AttributeLinksContainer => ({
    linksMap: new Map<ObjectTypeId, AttributeLinks>(),
  }),
  getters: {
    attributes: (state) => (objectTypeId: ObjectTypeId): CustomAttribute[] => {
      const atrributeLinks = state.linksMap.get(objectTypeId);
      if (!atrributeLinks) {
        return [];
      }
      return atrributeLinks.attributes;
    },
  },
  actions: {
    async initialize(objectTypeId: ObjectTypeId): Promise<void> {
      const attrLinks = await attributeLinkService.getByObjectTypeId(objectTypeId);
      if (attrLinks) {
        this.linksMap.set(objectTypeId, attrLinks);
      }
    },
    deleteLinks(targetAttrs: CustomAttribute[], objectTypeId: ObjectTypeId): void {
      const atrributeLinks = this.linksMap.get(objectTypeId);
      if (atrributeLinks) {
        atrributeLinks.attributes = atrributeLinks.attributes.filter(
          (attribute) => !targetAttrs.find(
            (targetAttr) => targetAttr.id === attribute.id,
          ),
        );
        this.linksMap.set(objectTypeId, atrributeLinks);
      }
    },
    addLink(targetAttr: CustomAttribute, objectTypeId: ObjectTypeId): void {
      const atrributeLinks = this.linksMap.get(objectTypeId);
      if (atrributeLinks) {
        atrributeLinks.attributes.push(targetAttr);
      }
    },
  },
});
