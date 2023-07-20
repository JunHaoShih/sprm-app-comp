import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { OffsetPaginationData } from 'src/models/paginations/OffsetPaginationResponse';
import { handleGenericError, handleGenericResponse, handlePaginationResponse } from 'src/services/AxiosHandlingService';
import { api } from 'src/boot/axios';
import { AppUser } from '../models/AppUser';
import { CreateAppUserDto } from '../dtos/CreateAppUserDto';

export const appUserService = {
  getByPattern: async (pattern: string, pagination: OffsetPaginationInput):
  Promise<OffsetPaginationData<AppUser[]> | null> => {
    const response = await api
      .get('/api/AppUser/Search', {
        params: {
          pattern,
          page: pagination.page,
          perPage: pagination.perPage,
        },
      })
      .then(handlePaginationResponse<AppUser>)
      .catch(handleGenericError);
    return response;
  },
  getById: async (id: number): Promise<AppUser | null> => {
    const response = await api
      .get(`/api/AppUser/${id}`)
      .then(handleGenericResponse<AppUser>)
      .catch(handleGenericError);
    return response;
  },
  create: async (createDto: CreateAppUserDto): Promise<AppUser | null> => {
    const part = await api
      .post('/api/AppUser', createDto)
      .then(handleGenericResponse<AppUser>)
      .catch(handleGenericError);
    return part;
  },
};
