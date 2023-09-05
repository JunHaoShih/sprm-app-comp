import axios, { AxiosError, AxiosResponse } from 'axios';
import { Notify } from 'quasar';
import { SPRMResponse } from 'src/models/SPRMResponse';
import { OffsetPaginationData } from 'src/models/paginations/OffsetPaginationResponse';
import { paginationService } from './PaginationService';

export type AxiosBaseError = Error | AxiosError;

function displayUnknownErrorNotify() {
  Notify.create({
    message: 'Something went wrong',
    color: 'red',
    icon: 'error',
  });
}

export function handleGenericError(error: AxiosBaseError) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      // Do not display any message on 401
      return null;
    }
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
    displayUnknownErrorNotify();
  }
  return null;
}

export function handleGenericResponse<T>(response: AxiosResponse): T {
  const data = response.data as SPRMResponse<T>;
  return data.content;
}

export function handleCode(response: AxiosResponse): number {
  const data = response.data as SPRMResponse<string>;
  return data.code;
}

export function handlePaginationResponse<T>(response: AxiosResponse): OffsetPaginationData<T[]> {
  const data = response.data as SPRMResponse<T[]>;
  return {
    pagination: paginationService.getHeaderPagination(response),
    content: data.content,
  };
}

export function selfManageError<T>(
  onAxiosError: (body: SPRMResponse<T>, error: AxiosError) => void,
  error: AxiosBaseError,
): false {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const body: SPRMResponse<T> = error.response.data;
      onAxiosError(body, error);
    }
  } else {
    displayUnknownErrorNotify();
  }
  return false;
}
