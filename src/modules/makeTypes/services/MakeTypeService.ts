import { api } from 'src/boot/axios';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { Notify } from 'quasar';
import { MakeType } from '../models/MakeType';

export const makeTypeService = {
  getAll: async (): Promise<MakeType[] | null> => {
    const partsResponse = await api
      .get(encodeURI('/api/MakeType'))
      .then((response): MakeType[] => {
        const data = response.data as SPRMResponse<MakeType[]>;
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
    return partsResponse;
  },
};
