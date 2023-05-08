import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { ObjectTypeId } from 'src/modules/objectTypes/models/ObjectType';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { AttributeLinks } from '../models/AttributeLinks';
import { CreateAttributeLinksDTO } from '../dtos/CreateAttributeLinksDTO';
import { DeleteAttributeLinksDTO } from '../dtos/DeleteAttributeLinksDTO';

/**
 * Get attribute links by object type id
 * @param objectTypeId object type id
 * @returns AttributeLinks (null if error occured)
 */
const getByObjectTypeId = async (objectTypeId: ObjectTypeId): Promise<AttributeLinks | null> => {
  const attributeLinks = await api.get(`api/AttributeLink/ByObjectType?objectTypeId=${objectTypeId}`)
    .then((response): AttributeLinks => {
      const data = response.data as SPRMResponse<AttributeLinks>;
      return data.content;
    })
    .catch((error) => {
      let message = '';
      if (error.response) {
        const body: SPRMResponse<string> = error.response.data;
        message = `Error: ${body.code}, ${body.message}`;
      } else if (error.request) {
        // The request was made but no response was received
        message = 'Error: No response';
      } else {
        // Something happened in setting up the request that triggered an Error
        message = 'Something went wrong';
      }
      Notify.create({
        message,
        color: 'red',
        icon: 'error',
      });
      return null;
    });
  return attributeLinks;
};

/**
 * Insert a group of attribute links
 * @param createDTO attribute links create DTO
 * @returns AttributeLinks (null if error occured)
 */
const insert = async (createDTO: CreateAttributeLinksDTO) => {
  const attributeLinks = await api.post('api/AttributeLink', createDTO)
    .then((response): AttributeLinks => {
      const data = response.data as SPRMResponse<AttributeLinks>;
      return data.content;
    })
    .catch((error) => {
      let message = '';
      if (error.response) {
        const body: SPRMResponse<string> = error.response.data;
        message = `Error: ${body.code}, ${body.message}`;
      } else if (error.request) {
        // The request was made but no response was received
        message = 'Error: No response';
      } else {
        // Something happened in setting up the request that triggered an Error
        message = 'Something went wrong';
      }
      Notify.create({
        message,
        color: 'red',
        icon: 'error',
      });
      return null;
    });
  return attributeLinks;
};

const deleteMultiple = async (deleteDTO: DeleteAttributeLinksDTO) => {
  const code = await api.delete('api/AttributeLink', { data: deleteDTO })
    .then((response): number => {
      const data = response.data as SPRMResponse<string>;
      return data.code;
    })
    .catch((error) => {
      let message = '';
      if (error.response) {
        const body: SPRMResponse<string> = error.response.data;
        message = `Error: ${body.code}, ${body.message}`;
      } else if (error.request) {
        // The request was made but no response was received
        message = 'Error: No response';
      } else {
        // Something happened in setting up the request that triggered an Error
        message = 'Something went wrong';
      }
      Notify.create({
        message,
        color: 'red',
        icon: 'error',
      });
      return null;
    });
  return code;
};

export const attributeLinkService = {
  getByObjectTypeId,
  insert,
  deleteMultiple,
};
