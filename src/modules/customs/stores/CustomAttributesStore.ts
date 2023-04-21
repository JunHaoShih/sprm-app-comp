import { defineStore } from 'pinia';
import { CustomAttribute } from '../models/CustomAttribute';
import { customAttributeService } from '../services/CustomAttributeService';

export interface CustomAttributesContainer {
  attributes: CustomAttribute[],
}

export const useCustomAttributesStore = defineStore('customAttributes', {
  state: (): CustomAttributesContainer => ({
    attributes: [],
  }),
  getters: {
    filteredAttributes: (state) => (pattern: string): CustomAttribute[] => state.attributes.filter(
      (attribute) => attribute.number.match(pattern) || attribute.name.match(pattern),
    ),
  },
  actions: {
    async initialize(): Promise<void> {
      const attrs = await customAttributeService.getAll();
      if (attrs) {
        this.setAttributes(attrs);
      }
    },
    setAttributes(attrs: CustomAttribute[]): void {
      this.attributes = attrs;
    },
    addAttribute(attr: CustomAttribute): void {
      this.attributes.push(attr);
    },
    removeAttribute(id: number): void {
      this.attributes = this.attributes.filter((attr) => attr.id !== id);
    },
  },
});
