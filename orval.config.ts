// orval.config.ts
import { defineConfig } from 'orval';
import { getBackendConfig } from './scripts/backend-config.js';

export default defineConfig({
  replies: {
    input: { target: getBackendConfig().swaggerUrl },
    output: {
      target: 'src/api/index.ts',
      schemas: 'src/api',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'tags-split',
      clean: true,
      prettier: true,
    },
  },
});
