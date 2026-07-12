import { drizzle } from 'drizzle-orm/postgres-js';
import { queryClient } from './client';
import * as schema from '../schema';

// Singleton database instance
export const db = drizzle(queryClient, { schema });

// Export type for repositories to use
export type Database = typeof db;
