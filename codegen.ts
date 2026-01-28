import type { CodegenConfig } from '@graphql-codegen/cli';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const config: CodegenConfig = {
  schema: {
    'https://api.github.com/graphql': {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    },
  },
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/types/github-generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typed-document-node'
      ],
    },
  },
  ignoreNoDocuments: true,
};

export default config;