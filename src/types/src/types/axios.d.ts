import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }

  export interface InternalAxiosRequestConfig {
    skipAuthRedirect?: boolean;
  }
}