import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { OffsetPaginationData } from 'src/models/paginations/OffsetPaginationResponse';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { paginationService } from 'src/services/PaginationService';
import { Routing } from '../models/Routing';
import { CreateRoutingDTO } from '../dtos/CreateRoutingDTO';

export const routingService = {
  /**
   * Get routings of specific part
   * @param partId Part id
   * @param pagination Offset pagination data
   * @returns Routing array
   */
  getByPartId: async (partId: number, pagination: OffsetPaginationInput):
  Promise<OffsetPaginationData<Routing[]> | null> => {
    const partsResponse = await api
      .get(encodeURI(`/api/Part/${partId}/Routing`), {
        params: {
          page: pagination.page,
          perPage: pagination.perPage,
        },
      })
      .then((response): OffsetPaginationData<Routing[]> => {
        const data = response.data as SPRMResponse<Routing[]>;
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
   * Create a new routing
   * @param createDto Create DTO
   * @returns New routing if success
   */
  create: async (createDto: CreateRoutingDTO): Promise<Routing | null> => {
    const part = await api.post('/api/Part', createDto)
      .then((response): Routing => {
        const data = response.data as SPRMResponse<Routing>;
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
