import { defineConfig } from 'orval';

export default defineConfig({
  toodl: {
    input: './swagger.json',
    output: {
      mode: 'split',
      target: './src/api/generated/toodl.ts',
      schemas: './src/api/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        operationName: (operation, route, verb) => {
          const tag = (operation.tags?.[0] || '').toLowerCase();
          const opId = operation.operationId;
          return `${tag}${opId}`;
        },
        mutator: {
          path: './src/api/api.ts',
          name: 'api',
        },
        query: {
          useQuery: true,
          useSuspenseQuery: true,
          useInfinite: false,
        },
      },
    },
  },
});
