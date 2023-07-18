import { OffsetPaginationInput } from 'src/models/paginations/OffsetPaginationInput';
import { OffsetPaginationData } from 'src/models/paginations/OffsetPaginationResponse';
import { handleGenericError, handlePaginationResponse } from 'src/services/AxiosHandlingService';
import { api } from 'src/boot/axios';
import { AppUser } from '../models/AppUser';

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
};
