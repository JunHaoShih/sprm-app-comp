import { Notify } from 'quasar';
import { api } from 'src/boot/axios';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { RoutingUsage } from '../models/RoutingUsage';

export const routingUsageService = {
  getByRootVersionId: async (rootVersionId: number) => {
    const searchUrl = `/api/RoutingVersion/${rootVersionId}/RoutingUsage`;
    const partUsages = await api.get(encodeURI(searchUrl))
      .then((response): RoutingUsage[] => {
        const data = response.data as SPRMResponse<RoutingUsage[]>;
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
    return partUsages;
  },
};
