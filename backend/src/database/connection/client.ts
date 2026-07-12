import postgres from 'postgres';
import { databaseConfig } from '../../config/database.config';

// Singleton query client for connection pooling
const queryClient = postgres(databaseConfig.DATABASE_URL, {
  max: 20,
  idle_timeout: 30, // seconds
  connect_timeout: 10,
  prepare: false, // Required for Neon serverless pooler in transaction mode
});

export { queryClient };
