import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { getBackendConfig } from './scripts/backend-config.js';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: getBackendConfig(mode).backendUrl,
        changeOrigin: true,
        // Preserve the browser origin for backend-generated OAuth callback URLs.
        xfwd: true,
      },
    },
  },
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
}));
