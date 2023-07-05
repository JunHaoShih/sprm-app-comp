import { api } from 'src/boot/axios';
import { i18n } from 'src/boot/i18n';
import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { OffsetPaginationData } from 'src/models/paginations/OffsetPaginationResponse';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { paginationService } from 'src/services/PaginationService';
import { Notify } from 'quasar';
import { Process } from '../models/Process';
import { CreateProcessDTO } from '../dtos/CreateProcessDTO';
import { UpdateProcessDTO } from '../dtos/UpdateProcessDTO';

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
  getById: async (id: number): Promise<Process | null> => {
    const partsResponse = await api
      .get(encodeURI(`/api/Process/${id}`))
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
    return partsResponse;
  },
  update: async (id: number, dto: UpdateProcessDTO): Promise<number | null> => {
    const updateUrl = `/api/Process/${id}`;
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
  remove: async (id: number): Promise<boolean> => {
    const success = await api.delete(`/api/Process/${id}`)
      .then((): boolean => true)
      .catch((error): boolean => {
        if (error.response) {
          const body: SPRMResponse<string> = error.response.data;
          let bodyMessage = '';
          if (body.code === 302) {
            bodyMessage = i18n.global.t('processes.notExist');
          } else if (body.code === 303) {
            bodyMessage = i18n.global.t('processes.alreadyInUse');
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
