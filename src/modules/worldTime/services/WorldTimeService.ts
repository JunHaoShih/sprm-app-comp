import axios from 'axios';
import { WorldTimeResponse } from '../models/WorldTimeResponse';

const getUtcTime = async (): Promise<WorldTimeResponse> => {
  const worldTimeResponse = await axios.get('https://worldtimeapi.org/api/timezone/Etc/UTC')
    .then((response): WorldTimeResponse => response.data as WorldTimeResponse);
  return worldTimeResponse;
};

export const worldTimeService = {
  getUtcTime,
};
