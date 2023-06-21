import { api } from 'src/boot/axios';
import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { OffsetPaginationData } from 'src/models/paginations/OffsetPaginationResponse';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { paginationService } from 'src/services/PaginationService';
import { Notify } from 'quasar';
import { Process } from '../models/Process';
import { CreateProcessDTO } from '../dtos/CreateProcessDTO';

export const processService = {
  /**
   * Search processes with pattern
   * @param pattern Pattern string
   * @param pagination Offset pagination data
   * @returns part array
   */
  getByPattern: async (pattern: string, pagination: OffsetPaginationInput):
  Promise<OffsetPaginationData<Process[]> | null> => {
    const partsResponse = await api
      .get(encodeURI('/api/Process/Search'), {
        params: {
          pattern,
          page: pagination.page,
          perPage: pagination.perPage,
        },
      })
      .then((response): OffsetPaginationData<Process[]> => {
        const data = response.data as SPRMResponse<Process[]>;
        return {
          pagination: paginationService.getHeaderPagination(response),
          content: data.content,
        };
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
  /**
   * Create rocess
   * @param createDto Create params
   * @returns Created process
   */
  create: async (createDto: CreateProcessDTO): Promise<Process | null> => {
    const part = await api.post('/api/Process', createDto)
      .then((response): Process => {
        const data = response.data as SPRMResponse<Process>;
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
    return part;
  },
};
