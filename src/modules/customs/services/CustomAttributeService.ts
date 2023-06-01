import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { CreateCustomAttributeDTO } from '../dtos/CreateCustomAttributeDTO';
import { CustomAttribute } from '../models/CustomAttribute';
import { UpdateCustomAttributeDTO } from '../dtos/UpdateCustomAttributeDTO';

/**
 * Create new custom attribute
 * @param createDto create data
 * @returns Created custom attribute
 */
const create = async (createDto: CreateCustomAttributeDTO)
: Promise<CustomAttribute | null> => {
  const newAttribute = await api.post('/api/CustomAttribute', createDto)
    .then((response): CustomAttribute => {
      const data = response.data as SPRMResponse<CustomAttribute>;
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
  return newAttribute;
};

/**
 * Update a custom attribute
 * @param id custom attribute id you want to update
 * @param updateDto update data
 * @returns no special resonse data
 */
const update = async (id: number, updateDto: UpdateCustomAttributeDTO)
: Promise<number | null> => {
  const returnMessage = await api.put(`/api/CustomAttribute/${id}`, updateDto)
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
  return returnMessage;
};

/**
 * Get all custom attributes
 * @returns All custom attributes
 */
const getAll = async () : Promise<CustomAttribute[] | null> => {
  const attributes = await api.get('/api/CustomAttribute')
    .then((response): CustomAttribute[] => {
      const data = response.data as SPRMResponse<CustomAttribute[]>;
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
  return attributes;
};

/**
 * Delete custom attribute by id
 * @param id custom attribute id
 * @returns body code
 */
const remove = async (id: number): Promise<number | null> => {
  const returnMessage = await api.delete(`/api/CustomAttribute/${id}`)
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
  return returnMessage;
};

export const customAttributeService = {
  create,
  getAll,
  update,
  remove,
};
