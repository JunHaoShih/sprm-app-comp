import { api } from 'src/boot/axios';
import { Notify } from 'quasar';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { AuthenticationResponse } from '../models/AuthenticationResponse';
import { AuthenticationDTO } from '../models/AuthenticationDTO';

export const authService = {
  login: async (username: string, password: string):
  Promise<SPRMResponse<AuthenticationResponse> | null> => {
    const loginDTO: AuthenticationDTO = {
      username,
      password,
    };
    const authResponse = await api.post('/api/Authentication', loginDTO)
      .then((response): SPRMResponse<AuthenticationResponse> => {
        const data = response.data as SPRMResponse<AuthenticationResponse>;
        localStorage.setItem('token', data.content.token);
        return data;
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
    return authResponse;
  },
};
