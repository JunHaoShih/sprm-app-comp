import { api } from 'src/boot/axios';
import { handleGenericError, handleGenericResponse } from 'src/services/AxiosHandlingService';
import { ObjectType } from './models/ObjectType';

export const objectTypeService = {
  getAll: async (): Promise<ObjectType[] | null> => {
    const objectTypes = await api.get('/api/ObjectType')
      .then(handleGenericResponse<ObjectType[]>)
      .catch(handleGenericError);
    return objectTypes;
  },
  getCustomizables: async (): Promise<ObjectType[] | null> => {
    const objectTypes = await api.get('/api/ObjectType/Customizable')
      .then(handleGenericResponse<ObjectType[]>)
      .catch(handleGenericError);
    return objectTypes;
  },
  getPermissibles: async (): Promise<ObjectType[] | null> => {
    const objectTypes = await api.get('/api/ObjectType/Permissible')
      .then(handleGenericResponse<ObjectType[]>)
      .catch(handleGenericError);
    return objectTypes;
  },
};
