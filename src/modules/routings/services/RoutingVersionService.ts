import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { OffsetPaginationData } from 'src/models/paginations/OffsetPaginationResponse';
import { api } from 'src/boot/axios';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { paginationService } from 'src/services/PaginationService';
import { Notify } from 'quasar';
import { RoutingVersion } from '../models/RoutingVersion';
import { UpdateRoutingVersionDTO } from '../dtos/UpdateRoutingVersionDTO';

export const routingVersionService = {
  getRoutingVersions: async (routingId: number, pagination: OffsetPaginationInput):
  Promise<OffsetPaginationData<RoutingVersion[]> | null> => {
    const partsResponse = await api
      .get(`/api/Routing/${routingId}/RoutingVersion`, {
        params: {
          page: pagination.page,
          perPage: pagination.perPage,
        },
      })
      .then((response): OffsetPaginationData<RoutingVersion[]> => {
        const data = response.data as SPRMResponse<RoutingVersion[]>;
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
  getById: async (versionId: number): Promise<RoutingVersion | null> => {
    const partsResponse = await api
      .get(`/api/RoutingVersion/${versionId}`)
      .then((response): RoutingVersion => {
        const data = response.data as SPRMResponse<RoutingVersion>;
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
  update: async (id: number, dto: UpdateRoutingVersionDTO) => {
    const updateUrl = `/api/RoutingVersion/${id}`;
    const code = await api.put(encodeURI(updateUrl), dto)
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
    return code;
  },
};
