import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));

export function getBackendConfig(mode = 'development') {
  const env = loadEnv(mode, projectRoot, 'BACKEND_URL');
  const backendUrl = (env.BACKEND_URL || 'http://localhost:5094').replace(/\/+$/, '');

  return {
    backendUrl,
    swaggerUrl: `${backendUrl}/swagger/v1/swagger.json`,
  };
}
