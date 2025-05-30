import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

/**
 * Database configuration from environment variables
 */
const dbConfig = {
  host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432'),
  database: process.env.DB_NAME || process.env.PGDATABASE || 'cms_pages',
  user: process.env.DB_USER || process.env.PGUSER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || '',
  ssl: false,
  max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
};

// Build connection string if DATABASE_URL is not provided
let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  connectionString = `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
}

if (!connectionString) {
  throw new Error(
    'Database configuration is missing. Please set DATABASE_URL or individual DB_* environment variables.',
  );
}

console.log('Attempting to connect to database...');
console.log('Connection string (masked):', connectionString.replace(/:[^:@]+@/, ':****@'));

/**
 * Create a connection pool for PostgreSQL
 */
export const pool: Pool = new Pool({
  connectionString,
  max: dbConfig.max,
  idleTimeoutMillis: dbConfig.idleTimeoutMillis,
  connectionTimeoutMillis: dbConfig.connectionTimeoutMillis,
  ssl: dbConfig.ssl,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.on('connect', () => {
  console.log('Successfully connected to the database');
});

/**
 * Drizzle ORM instance
 */
export const db = drizzle(pool, { schema });