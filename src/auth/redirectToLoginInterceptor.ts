import axios from 'axios';
import type { AxiosError } from 'axios';

export function redirectToLogin() {
  const currentUrl = window.location.pathname + window.location.search + window.location.hash;
  const returnUrl = encodeURIComponent(currentUrl);

  window.location.assign(`/login?returnUrl=${returnUrl}`);
}

let isRedirectingToLogin = false;

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !isRedirectingToLogin) {
      isRedirectingToLogin = true;
      redirectToLogin();
    }

    return Promise.reject(error);
  },
);