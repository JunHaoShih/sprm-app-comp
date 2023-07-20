import { api } from 'src/boot/axios';
import { handleCode, handleGenericError, handleGenericResponse } from 'src/services/AxiosHandlingService';
import { Permission } from '../models/Permission';
import { UpdatePermissionDto } from '../dtos/UpdatePermissionDto';

export const permissionService = {
  getByUserId: async (userId: number): Promise<Permission[] | null> => {
    const response = await api
      .get(`/api/AppUser/${userId}/Permission`)
      .then(handleGenericResponse<Permission[]>)
      .catch(handleGenericError);
    return response;
  },
  updateByUserId: async (userId: number, dtos: UpdatePermissionDto[]) => {
    const response = await api
      .put(`/api/AppUser/${userId}/Permission`, dtos)
      .then(handleCode)
      .catch(handleGenericError);
    return response;
  },
};
