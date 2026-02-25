export interface ApiErrorResponse {
  ok: false;
  message: string;
}

export interface ApiSuccessResponse<T> {
  ok: true;
  data: T;
}

export type ApiResponse<T> = ApiErrorResponse | ApiSuccessResponse<T>;
