import { api } from 'src/boot/axios';
import { i18n } from 'src/boot/i18n';
import { Notify } from 'quasar';
import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { OffsetPaginationData } from 'src/models/paginations/OffsetPaginationResponse';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { paginationService } from 'src/services/PaginationService';
import { Part } from '../models/Part';
import { CreatePartDTO } from '../dtos/CreatePartDTO';

export const partService = {
  /**
   * Search part with pattern
   * @param pattern Pattern string
   * @param pagination Offset pagination data
   * @returns part array
   */
  getByPattern: async (pattern: string, pagination: OffsetPaginationInput):
  Promise<OffsetPaginationData<Part[]> | null> => {
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
  getById: async (id: number): Promise<Part | null> => {
    const searchUrl = `/api/Part/${id}`;
    const partResponse = await api.get(encodeURI(searchUrl))
      .then((response): Part => {
        const data = response.data as SPRMResponse<Part>;
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
    return partResponse;
  },
  /**
   * Create part
   * @param createDto Create params
   * @returns Created part
   */
  create: async (createDto: CreatePartDTO): Promise<Part | null> => {
    const part = await api.post('/api/Part', createDto)
      .then((response): Part => {
        const data = response.data as SPRMResponse<Part>;
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
  checkIn: async (id: number): Promise<Part | null> => {
    const part = await api.post(`/api/Part/${id}/CheckIn`)
      .then((response): Part => {
        const data = response.data as SPRMResponse<Part>;
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
  checkOut: async (id: number): Promise<Part | null> => {
    const part = await api.post(`/api/Part/${id}/CheckOut`)
      .then((response): Part => {
        const data = response.data as SPRMResponse<Part>;
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
  discard: async (id: number): Promise<Part | null> => {
    const part = await api.delete(`/api/Part/${id}/Discard`)
      .then((response): Part => {
        const data = response.data as SPRMResponse<Part>;
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
  remove: async (id: number): Promise<boolean> => {
    const success = await api.delete(`/api/Part/${id}`)
      .then((): boolean => true)
      .catch((error): boolean => {
        if (error.response) {
          const body: SPRMResponse<string> = error.response.data;
          let bodyMessage = '';
          if (body.code === 302) {
            bodyMessage = i18n.global.t('processes.notExist');
          } else if (body.code === 303) {
            bodyMessage = i18n.global.t('parts.alreadyInUse');
          } else {
            bodyMessage = body.message;
          }
          const message = `Error: ${body.code}, ${bodyMessage}`;
          Notify.create({
            message,
            color: 'red',
            icon: 'error',
          });
        }
        return false;
      });
    return success;
  },
};
