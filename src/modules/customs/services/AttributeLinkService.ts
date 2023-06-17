import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { AttributeLinks } from '../models/AttributeLinks';
import { CreateAttributeLinksDTO } from '../dtos/CreateAttributeLinksDTO';
import { DeleteAttributeLinksDTO } from '../dtos/DeleteAttributeLinksDTO';

export const attributeLinkService = {
  /**
   * Get attribute links by object type id
   * @param objectTypeId object type id
   * @returns AttributeLinks (null if error occured)
   */
  getByObjectTypeId: async (objectTypeId: SprmObjectType): Promise<AttributeLinks | null> => {
    const attributeLinks = await api
      .get('/api/AttributeLink/ByObjectType', {
        params: {
          objectTypeId,
        },
      })
      .then((response): AttributeLinks => {
        const data = response.data as SPRMResponse<AttributeLinks>;
        return data.content;
      })
      .catch((error) => {
        if (error.response) {
          const body: SPRMResponse<string> = error.response.data;
          const message = `Error: ${body.code}, ${body.message}`;
          Notify.create({
            message,
            color: 'red',
            icon: 'error',
          });
        }
        return null;
      });
    return attributeLinks;
  },
  /**
   * Insert a group of attribute links
   * @param createDTO attribute links create DTO
   * @returns AttributeLinks (null if error occured)
   */
  insert: async (createDTO: CreateAttributeLinksDTO) => {
    const attributeLinks = await api.post('/api/AttributeLink', createDTO)
      .then((response): AttributeLinks => {
        const data = response.data as SPRMResponse<AttributeLinks>;
        return data.content;
      })
      .catch((error) => {
        if (error.response) {
          const body: SPRMResponse<string> = error.response.data;
          const message = `Error: ${body.code}, ${body.message}`;
          Notify.create({
            message,
            color: 'red',
            icon: 'error',
          });
        }
        return null;
      });
    return attributeLinks;
  },
  deleteMultiple: async (deleteDTO: DeleteAttributeLinksDTO) => {
    const code = await api.delete('/api/AttributeLink', { data: deleteDTO })
      .then((response): number => {
        const data = response.data as SPRMResponse<string>;
        return data.code;
      })
      .catch((error) => {
        if (error.response) {
          const body: SPRMResponse<string> = error.response.data;
          const message = `Error: ${body.code}, ${body.message}`;
          Notify.create({
            message,
            color: 'red',
            icon: 'error',
          });
        }
        return null;
      });
    return code;
  },
};
