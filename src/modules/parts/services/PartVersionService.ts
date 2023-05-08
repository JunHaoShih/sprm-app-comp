import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { PartVersion } from '../models/PartVersion';
import { UpdatePartVersionDTO } from '../dtos/UpdatePartVersionDTO';

const getById = async (id: number): Promise<PartVersion | null> => {
  const searchUrl = `/api/PartVersion/${id}`;
  const partVersionResponse = await api.get(encodeURI(searchUrl))
    .then((response): PartVersion => {
      const data = response.data as SPRMResponse<PartVersion>;
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
  return partVersionResponse;
};

const update = async (id: number, dto: UpdatePartVersionDTO): Promise<number | null> => {
  const updateUrl = `/api/PartVersion/${id}`;
  const code = await api.put(encodeURI(updateUrl), dto)
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

export const partVersionService = {
  getById,
  update,
};
