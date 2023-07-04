import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { CreateCustomAttributeDTO } from '../dtos/CreateCustomAttributeDTO';
import { CustomAttribute } from '../models/CustomAttribute';
import { UpdateCustomAttributeDTO } from '../dtos/UpdateCustomAttributeDTO';

export const customAttributeService = {
  /**
   * Create new custom attribute
   * @param createDto create data
   * @returns Created custom attribute
   */
  create: async (createDto: CreateCustomAttributeDTO)
  : Promise<CustomAttribute | null> => {
    const newAttribute = await api.post('/api/CustomAttribute', createDto)
      .then((response): CustomAttribute => {
        const data = response.data as SPRMResponse<CustomAttribute>;
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
    return newAttribute;
  },
  /**
   * Get all custom attributes
   * @returns All custom attributes
   */
  getAll: async () : Promise<CustomAttribute[] | null> => {
    const attributes = await api.get('/api/CustomAttribute')
      .then((response): CustomAttribute[] => {
        const data = response.data as SPRMResponse<CustomAttribute[]>;
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
    return attributes;
  },
  /**
   * Update a custom attribute
   * @param id custom attribute id you want to update
   * @param updateDto update data
   * @returns no special resonse data
   */
  update: async (id: number, updateDto: UpdateCustomAttributeDTO)
  : Promise<number | null> => {
    const returnMessage = await api.put(`/api/CustomAttribute/${id}`, updateDto)
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
    return returnMessage;
  },
  /**
   * Delete custom attribute by id
   * @param id custom attribute id
   * @returns body code
   */
  remove: async (id: number): Promise<number | null> => {
    const returnMessage = await api.delete(`/api/CustomAttribute/${id}`)
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
    return returnMessage;
  },
};
