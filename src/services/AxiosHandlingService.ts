import axios, { AxiosError, AxiosResponse } from 'axios';
import { Notify } from 'quasar';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { OffsetPaginationData } from 'src/models/paginations/OffsetPaginationResponse';
import { paginationService } from './PaginationService';

export type AxiosBaseError = Error | AxiosError;

export function handleGenericError(error: AxiosBaseError) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const body: SPRMResponse<string> = error.response.data;
      const message = `Error: ${body.code}, ${body.message}`;
      Notify.create({
        message,
        color: 'red',
        icon: 'error',
      });
    }
  } else {
    Notify.create({
      message: 'Something went wrong',
      color: 'red',
      icon: 'error',
    });
  }
  return null;
}

export function handleGenericResponse<T>(response: AxiosResponse): T {
  const data = response.data as SPRMResponse<T>;
  return data.content;
}

export function handlePaginationResponse<T>(response: AxiosResponse): OffsetPaginationData<T[]> {
  const data = response.data as SPRMResponse<T[]>;
  return {
    pagination: paginationService.getHeaderPagination(response),
    content: data.content,
  };
}
