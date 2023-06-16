import { api } from 'src/boot/axios';
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
  async getByPattern(pattern: string, pagination: OffsetPaginationInput):
  Promise<OffsetPaginationData<Part[]> | null> {
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
  async getById(id: number): Promise<Part | null> {
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
  async create(createDto: CreatePartDTO): Promise<Part | null> {
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
  async checkIn(id: number): Promise<Part | null> {
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
  async checkOut(id: number): Promise<Part | null> {
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
  async discard(id: number): Promise<Part | null> {
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
};
