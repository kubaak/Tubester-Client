import axios from 'axios';
import type { AxiosError } from 'axios';

let isRedirectingToLogout = false;

export function redirectToLogout() {
  if (
    window.location.pathname === '/login' ||
    window.location.pathname === '/logout' ||
    window.location.pathname === '/api/auth/logout'
  ) {
    return;
  }

  const currentUrl = window.location.pathname + window.location.search + window.location.hash;
  const returnUrl = encodeURIComponent(currentUrl);

  window.location.assign(`/api/auth/logout?returnUrl=${returnUrl}`);
}

axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      !error.config?.skipAuthRedirect &&
      !isRedirectingToLogout
    ) {
      isRedirectingToLogout = true;
      redirectToLogout();
    }

    return Promise.reject(error);
  },
);