import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { OffsetPaginationData } from 'src/models/paginations/OffsetPaginationResponse';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { paginationService } from 'src/services/PaginationService';
import { Part } from '../models/Part';

const getByPattern = async (pattern: string, pagination: OffsetPaginationInput):
Promise<OffsetPaginationData<Part[]> | null> => {
  // const searchUrl = `/api/Part/Search${pattern ? `?pattern=${pattern}` : ''}`;
  const partsResponse = await api
    .get(encodeURI('/api/Part/Search'), {
      params: {
        pattern,
        page: pagination.page,
        perPage: pagination.perPage,
      },
    })
    .then((response): OffsetPaginationData<Part[]> => {
      const data = response.data as SPRMResponse<Part[]>;
      return {
        pagination: paginationService.getHeaderPagination(response),
        content: data.content,
      };
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
        icon: 'error',
      });
      return null;
    });
  return partResponse;
};

export const partService = {
  getByPattern,
  getById,
};
