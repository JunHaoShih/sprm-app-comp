import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { OffsetPaginationData } from 'src/models/paginations/OffsetPaginationResponse';
import { paginationService } from 'src/services/PaginationService';
import { PartVersion } from '../models/PartVersion';
import { UpdatePartVersionDTO } from '../dtos/UpdatePartVersionDTO';

export const partVersionService = {
  getById: async (id: number): Promise<PartVersion | null> => {
    const searchUrl = `/api/PartVersion/${id}`;
    const partVersionResponse = await api.get(encodeURI(searchUrl))
      .then((response): PartVersion => {
        const data = response.data as SPRMResponse<PartVersion>;
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
    return partVersionResponse;
  },
  update: async (id: number, dto: UpdatePartVersionDTO): Promise<number | null> => {
    const updateUrl = `/api/PartVersion/${id}`;
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
  getPartVersions: async (partId: number, pagination: OffsetPaginationInput):
  Promise<OffsetPaginationData<PartVersion[]> | null> => {
    const partsResponse = await api
      .get(`/api/Part/${partId}/PartVersion`, {
        params: {
          page: pagination.page,
          perPage: pagination.perPage,
        },
      })
      .then((response): OffsetPaginationData<PartVersion[]> => {
        const data = response.data as SPRMResponse<PartVersion[]>;
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
};
