import { api } from 'src/boot/axios';
import { handleGenericError, handleGenericResponse } from 'src/services/AxiosHandlingService';
import { Permission } from '../models/Permission';

export const permissionService = {
  getByUserId: async (userId: number): Promise<Permission[] | null> => {
    const response = await api
      .get(`/api/AppUser/${userId}/Permission`)
      .then(handleGenericResponse<Permission[]>)
      .catch(handleGenericError);
    return response;
  },
};
