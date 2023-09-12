import { api } from 'src/boot/axios';
import axios from 'axios';
import { handleGenericError, handleGenericResponse } from 'src/services/AxiosHandlingService';
import { AuthenticationResponse } from '../models/AuthenticationResponse';
import { AuthenticationDto } from '../dtos/AuthenticationDto';
import { RefreshTokenDto } from '../dtos/RefreshTokenDto';

export const authService = {
  login: async (username: string, password: string): Promise<AuthenticationResponse | null> => {
    const loginDTO: AuthenticationDto = {
      username,
      password,
    };
    const authResponse = await api.post('/api/Authentication', loginDTO)
      .then(handleGenericResponse<AuthenticationResponse>)
      .catch(handleGenericError);
    return authResponse;
  },

  refreshToken: async (refreshToken: string): Promise<AuthenticationResponse | null> => {
    const refreshDto: RefreshTokenDto = {
      refreshToken,
    };
    const authResponse = await axios.post('/api/Authentication/Refresh', refreshDto)
      .then(handleGenericResponse<AuthenticationResponse>)
      .catch(handleGenericError);
    return authResponse;
  },

  logout: async (refreshToken: string) => {
    const refreshDto: RefreshTokenDto = {
      refreshToken,
    };
    const authResponse = await axios.post('/api/Authentication/Logout', refreshDto)
      .then(handleGenericResponse<string>)
      .catch(handleGenericError);
    return authResponse;
  },
};
