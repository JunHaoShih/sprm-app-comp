import { api } from 'src/boot/axios';
import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { OffsetPaginationData } from 'src/models/paginations/OffsetPaginationResponse';
import { handleGenericError, handleGenericResponse, handlePaginationResponse } from 'src/services/AxiosHandlingService';
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
      .then(handlePaginationResponse<Routing>)
      .catch(handleGenericError);
    return partsResponse;
  },
  /**
   * Create a new routing
   * @param createDto Create DTO
   * @returns New routing if success
   */
  create: async (createDto: CreateRoutingDTO): Promise<Routing | null> => {
    const part = await api.post('/api/Routing', createDto)
      .then(handleGenericResponse<Routing>)
      .catch(handleGenericError);
    return part;
  },
  getById: async (id: number): Promise<Routing | null> => {
    const searchUrl = `/api/Routing/${id}`;
    const partResponse = await api.get(encodeURI(searchUrl))
      .then(handleGenericResponse<Routing>)
      .catch(handleGenericError);
    return partResponse;
  },
  checkIn: async (id: number): Promise<Routing | null> => {
    const part = await api.post(`/api/Routing/${id}/CheckIn`)
      .then(handleGenericResponse<Routing>)
      .catch(handleGenericError);
    return part;
  },
  checkOut: async (id: number): Promise<Routing | null> => {
    const part = await api.post(`/api/Routing/${id}/CheckOut`)
      .then(handleGenericResponse<Routing>)
      .catch(handleGenericError);
    return part;
  },
  discard: async (id: number): Promise<Routing | null> => {
    const part = await api.delete(`/api/Routing/${id}/Discard`)
      .then(handleGenericResponse<Routing>)
      .catch(handleGenericError);
    return part;
  },
};
