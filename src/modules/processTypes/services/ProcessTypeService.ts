import { api } from 'src/boot/axios';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { Notify } from 'quasar';
import { ProcessType } from '../models/ProcessType';

export const processTypeService = {
  getAll: async (): Promise<ProcessType[] | null> => {
    const partsResponse = await api
      .get(encodeURI('/api/ProcessType'))
      .then((response): ProcessType[] => {
        const data = response.data as SPRMResponse<ProcessType[]>;
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
