import { AxiosResponse } from 'axios';
import { OffsetPaginationResponse } from 'src/models/paginations/OffsetPaginationResponse';

const getHeaderPagination = (response: AxiosResponse): OffsetPaginationResponse => {
  const pagination: OffsetPaginationResponse = JSON.parse(response.headers['x-pagination']);
  return pagination;
};

export const paginationService = {
  getHeaderPagination,
};
