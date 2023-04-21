import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { Part } from '../models/Part';

const getByPattern = async (pattern: string):
Promise<Part[] | null> => {
  const searchUrl = `/api/Part/Search${pattern ? `?pattern=${pattern}` : ''}`;
  const partsResponse = await api.get(encodeURI(searchUrl))
    .then((response): Part[] => {
      const data = response.data as SPRMResponse<Part[]>;
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
      });
      return null;
    });
  return partsResponse;
};

const getById = async (id: number): Promise<Part | null> => {
  const searchUrl = `/api/Part/${id}`;
  const partResponse = await api.get(encodeURI(searchUrl))
    .then((response): Part => {
      const data = response.data as SPRMResponse<Part>;
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
      });
      return null;
    });
  return partResponse;
};

export const partService = {
  getByPattern,
  getById,
};
