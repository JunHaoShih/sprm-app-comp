import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { ObjectType } from './models/ObjectType';

export const objectTypeService = {
  getAll: async (): Promise<ObjectType[] | null> => {
    const objectTypes = await api.get('/api/ObjectType')
      .then((response): ObjectType[] => {
        const data = response.data as SPRMResponse<ObjectType[]>;
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
    return objectTypes;
  },
};
