import { defineConfig } from 'drizzle-kit';
import { databaseConfig } from './src/config/database.config';

export default defineConfig({
  schema: './src/database/schema/index.ts',
  out: './src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseConfig.DATABASE_URL,
  },
  strict: true,
  verbose: true,
});
